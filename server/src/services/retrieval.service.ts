import { ChunkModel } from '../models/Chunk';
import { getDbStatus } from '../config/db';
import { inMemoryStore, IChunkItem } from '../storage/inMemoryStore';
import { EmbeddingsService } from './embeddings.service';

export interface SearchQuery {
  question: string;
  datasetId?: string;
  topK?: number;
}

export interface SearchResultItem {
  documentId: string;
  datasetId: string;
  documentName: string;
  pageNumber: number;
  chunkIndex: number;
  text: string;
  similarityScore: number;
  scorePercent: string;
  characterCount: number;
}

export interface RetrievalResponse {
  query: string;
  datasetId: string;
  totalCandidates: number;
  results: SearchResultItem[];
  embeddingProvider: string;
  searchMethod: string;
  latencyMs: number;
}

export class RetrievalService {
  /**
   * Core Knowledge Retrieval Pipeline:
   * question + datasetId -> semantic search -> relevant chunks -> similarity scores -> source metadata
   */
  public static async search(input: SearchQuery): Promise<RetrievalResponse> {
    const startTime = Date.now();
    const question = input.question?.trim() || '';
    const datasetId = input.datasetId || 'all';
    const topK = input.topK || 5;

    if (!question) {
      return {
        query: '',
        datasetId,
        totalCandidates: 0,
        results: [],
        embeddingProvider: 'none',
        searchMethod: 'none',
        latencyMs: Date.now() - startTime,
      };
    }

    // 1. Generate Vector Embedding for Question
    const embedRes = await EmbeddingsService.generateEmbedding(question);
    const questionEmbedding = embedRes.embedding;

    let candidateChunks: IChunkItem[] = [];
    let searchMethod = 'Cosine Similarity Engine';

    // 2. Fetch Chunks from MongoDB or InMemoryStore
    const dbStatus = getDbStatus();

    if (dbStatus.isConnected) {
      try {
        // Attempt MongoDB Atlas Vector Search if available
        const filter: any = {};
        if (datasetId && datasetId !== 'all') {
          filter.datasetId = datasetId;
        }

        // Try Atlas Vector Search Aggregation
        try {
          const vectorPipeline: any[] = [
            {
              $vectorSearch: {
                index: 'vector_index',
                path: 'embedding',
                queryVector: questionEmbedding,
                numCandidates: topK * 10,
                limit: topK,
                filter,
              },
            },
            {
              $project: {
                chunkId: 1,
                documentId: 1,
                datasetId: 1,
                documentName: 1,
                pageNumber: 1,
                chunkIndex: 1,
                text: 1,
                embedding: 1,
                characterCount: 1,
                score: { $meta: 'vectorSearchScore' },
              },
            },
          ];

          const mongoVectorResults = await ChunkModel.aggregate(vectorPipeline);
          if (mongoVectorResults && mongoVectorResults.length > 0) {
            searchMethod = 'MongoDB Vector Search ($vectorSearch)';
            candidateChunks = mongoVectorResults.map((m) => ({
              chunkId: m.chunkId,
              documentId: m.documentId,
              datasetId: m.datasetId,
              documentName: m.documentName,
              pageNumber: m.pageNumber,
              chunkIndex: m.chunkIndex,
              text: m.text,
              embedding: m.embedding,
              characterCount: m.characterCount,
              createdAt: m.createdAt ? new Date(m.createdAt) : new Date(),
            }));
          }
        } catch (vectorSearchErr) {
          // MongoDB Atlas Vector Search Index not defined or standard MongoDB - fall back to vector scan
        }

        // Fallback Mongo document query if vector search didn't run or returned 0
        if (candidateChunks.length === 0) {
          const mongoDocs = await ChunkModel.find(filter).lean();
          if (mongoDocs && mongoDocs.length > 0) {
            searchMethod = 'MongoDB Document Scan + Vector Cosine Ranker';
            candidateChunks = mongoDocs.map((m: any) => ({
              chunkId: m.chunkId,
              documentId: m.documentId,
              datasetId: m.datasetId,
              documentName: m.documentName,
              pageNumber: m.pageNumber,
              chunkIndex: m.chunkIndex,
              text: m.text,
              embedding: m.embedding,
              characterCount: m.characterCount,
              createdAt: m.createdAt ? new Date(m.createdAt) : new Date(),
            }));
          }
        }
      } catch (err: any) {
        console.warn(`[RetrievalService] MongoDB fetch error, falling back to in-memory: ${err.message}`);
      }
    }

    // If candidateChunks empty or DB offline, query InMemoryStore
    if (candidateChunks.length === 0) {
      candidateChunks = inMemoryStore.getChunksByDatasetId(datasetId);
      searchMethod = dbStatus.isConnected ? searchMethod : 'InMemory Store + Vector Cosine Ranker';
    }

    // 3. Compute Similarity Scores for candidate chunks
    const scoredResults: SearchResultItem[] = [];

    for (const chunk of candidateChunks) {
      const score = EmbeddingsService.cosineSimilarity(questionEmbedding, chunk.embedding);

      scoredResults.push({
        documentId: chunk.documentId,
        datasetId: chunk.datasetId,
        documentName: chunk.documentName,
        pageNumber: chunk.pageNumber,
        chunkIndex: chunk.chunkIndex,
        text: chunk.text,
        similarityScore: Math.round(score * 10000) / 10000,
        scorePercent: `${(score * 100).toFixed(1)}%`,
        characterCount: chunk.characterCount,
      });
    }

    // 4. Sort descending by similarity score
    scoredResults.sort((a, b) => b.similarityScore - a.similarityScore);

    // 5. Slice top K results
    const topResults = scoredResults.slice(0, topK);

    const latencyMs = Date.now() - startTime;

    return {
      query: question,
      datasetId,
      totalCandidates: candidateChunks.length,
      results: topResults,
      embeddingProvider: embedRes.provider,
      searchMethod,
      latencyMs,
    };
  }
}

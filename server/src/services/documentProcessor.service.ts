const pdfParse = require('pdf-parse');
import { DocumentModel, IDocument } from '../models/Document';
import { ChunkModel, IChunk } from '../models/Chunk';
import { getDbStatus } from '../config/db';
import { inMemoryStore, IDocumentItem, IChunkItem } from '../storage/inMemoryStore';
import { EmbeddingsService } from './embeddings.service';

export interface ProcessInput {
  fileBuffer?: Buffer;
  fileName: string;
  fileType?: string;
  datasetId?: string;
  category?: string;
  rawText?: string;
}

export interface ExtractedPage {
  pageNumber: number;
  text: string;
}

export interface ProcessedResult {
  documentId: string;
  datasetId: string;
  name: string;
  chunksCount: number;
  pagesCount: number;
  status: 'Indexed' | 'Processing' | 'Failed';
  storageUsed: 'mongodb' | 'in-memory';
  embeddingProvider: string;
  createdAt: Date;
}

export class DocumentProcessorService {
  /**
   * Main Document Ingestion Pipeline:
   * UPLOAD -> TEXT EXTRACTION -> CLEANING -> CHUNKING -> EMBEDDINGS -> MONGODB / STORE
   */
  public static async processDocument(input: ProcessInput): Promise<ProcessedResult> {
    const documentId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const datasetId = input.datasetId || 'default-dataset';
    const name = input.fileName || 'Untitled Document.txt';
    const category = input.category || 'General';

    console.log(`[DocumentProcessor] Processing document: "${name}" (ID: ${documentId}, Dataset: ${datasetId})`);

    // 1. EXTRACT TEXT & PAGE NUMBERS
    const pages = await this.extractTextAndPages(input);
    if (!pages || pages.length === 0 || pages.every((p) => !p.text.trim())) {
      throw new Error(`Text extraction produced empty content for file "${name}".`);
    }

    let totalRawLength = 0;
    pages.forEach((p) => (totalRawLength += p.text.length));

    // 2. CLEANING & CHUNKING
    const chunksToEmbed: Array<{
      pageNumber: number;
      chunkIndex: number;
      text: string;
    }> = [];

    let globalChunkIndex = 0;
    const chunkSize = 500;
    const chunkOverlap = 100;

    for (const page of pages) {
      const cleanedText = this.cleanText(page.text);
      if (!cleanedText) continue;

      const pageChunks = this.chunkText(cleanedText, chunkSize, chunkOverlap);
      for (const textChunk of pageChunks) {
        if (textChunk.trim().length < 15) continue; // skip tiny noise chunks

        chunksToEmbed.push({
          pageNumber: page.pageNumber,
          chunkIndex: globalChunkIndex++,
          text: textChunk.trim(),
        });
      }
    }

    if (chunksToEmbed.length === 0) {
      throw new Error(`Chunking produced 0 valid text chunks for file "${name}".`);
    }

    // 3. GENERATE EMBEDDINGS & PREPARE CHUNK RECORDS
    console.log(`[DocumentProcessor] Generating embeddings for ${chunksToEmbed.length} chunks...`);
    const chunkItems: IChunkItem[] = [];
    let usedProvider = 'local-tfidf';

    for (const item of chunksToEmbed) {
      const chunkId = `chk-${documentId}-${item.chunkIndex}`;
      const embedRes = await EmbeddingsService.generateEmbedding(item.text);
      usedProvider = embedRes.provider;

      chunkItems.push({
        chunkId,
        documentId,
        datasetId,
        documentName: name,
        pageNumber: item.pageNumber,
        chunkIndex: item.chunkIndex,
        text: item.text,
        embedding: embedRes.embedding,
        characterCount: item.text.length,
        metadata: {
          category,
          extractedAt: new Date().toISOString(),
        },
        createdAt: new Date(),
      });
    }

    // 4. PREPARE DOCUMENT METADATA
    const docItem: IDocumentItem = {
      documentId,
      datasetId,
      name,
      category,
      fileType: input.fileType || this.inferFileType(name),
      sizeBytes: input.fileBuffer ? input.fileBuffer.length : Buffer.byteLength(input.rawText || '', 'utf8'),
      chunksCount: chunkItems.length,
      trustScore: 100,
      status: 'Indexed',
      createdAt: new Date(),
    };

    // 5. MONGODB STORAGE WITH IN-MEMORY FALLBACK
    let storageUsed: 'mongodb' | 'in-memory' = 'in-memory';

    // Always mirror to In-Memory Store
    inMemoryStore.saveDocument(docItem);
    inMemoryStore.saveChunks(chunkItems);

    const dbStatus = getDbStatus();
    if (dbStatus.isConnected) {
      try {
        await DocumentModel.create({
          documentId: docItem.documentId,
          datasetId: docItem.datasetId,
          name: docItem.name,
          category: docItem.category,
          fileType: docItem.fileType,
          sizeBytes: docItem.sizeBytes,
          chunksCount: docItem.chunksCount,
          trustScore: docItem.trustScore,
          status: docItem.status,
          createdAt: docItem.createdAt,
        });

        const mongoChunks = chunkItems.map((c) => ({
          chunkId: c.chunkId,
          documentId: c.documentId,
          datasetId: c.datasetId,
          documentName: c.documentName,
          pageNumber: c.pageNumber,
          chunkIndex: c.chunkIndex,
          text: c.text,
          embedding: c.embedding,
          characterCount: c.characterCount,
          metadata: c.metadata,
          createdAt: c.createdAt,
        }));

        await ChunkModel.insertMany(mongoChunks);
        storageUsed = 'mongodb';
        console.log(`[DocumentProcessor] Successfully saved document & ${chunkItems.length} chunks to MongoDB`);
      } catch (err: any) {
        console.warn(`[DocumentProcessor Warning] Failed to write to MongoDB, fallback to in-memory: ${err.message}`);
      }
    } else {
      console.log(`[DocumentProcessor] MongoDB unavailable. Document stored in active in-memory repository.`);
    }

    return {
      documentId,
      datasetId,
      name,
      chunksCount: chunkItems.length,
      pagesCount: pages.length,
      status: 'Indexed',
      storageUsed,
      embeddingProvider: usedProvider,
      createdAt: docItem.createdAt,
    };
  }

  /**
   * STEP 1: Text & Page Extraction logic for PDF and Plain Text files
   */
  private static async extractTextAndPages(input: ProcessInput): Promise<ExtractedPage[]> {
    // If rawText provided directly
    if (input.rawText) {
      return this.partitionTextIntoPages(input.rawText);
    }

    if (!input.fileBuffer) {
      return [];
    }

    const fileType = (input.fileType || this.inferFileType(input.fileName)).toLowerCase();

    if (fileType === 'pdf') {
      try {
        const pages: ExtractedPage[] = [];
        
        // Custom pagerender to capture text page by page in pdf-parse
        let currentPage = 1;
        const pdfData = await pdfParse(input.fileBuffer, {
          pagerender: (pageData: any) => {
            return pageData.getTextContent().then((textContent: any) => {
              let lastY, text = '';
              for (const item of textContent.items) {
                if (lastY == item.transform[5] || !lastY) {
                  text += item.str;
                } else {
                  text += '\n' + item.str;
                }
                lastY = item.transform[5];
              }
              const pageNum = currentPage++;
              pages.push({ pageNumber: pageNum, text });
              return text;
            });
          },
        });

        if (pages.length > 0) {
          return pages;
        }

        // Fallback if pagerender yielded no items
        if (pdfData.text) {
          return this.partitionTextIntoPages(pdfData.text);
        }
      } catch (err: any) {
        console.warn(`[DocumentProcessor] pdf-parse warning: ${err.message}. Treating as text buffer.`);
      }
    }

    // Default: convert Buffer to UTF-8 string and partition
    const utf8Text = input.fileBuffer.toString('utf-8');
    return this.partitionTextIntoPages(utf8Text);
  }

  /**
   * Partition continuous text into numbered pages based on form feeds (\f) or character blocks
   */
  private static partitionTextIntoPages(fullText: string): ExtractedPage[] {
    // Check if form feeds (\f) exist
    if (fullText.includes('\f')) {
      const parts = fullText.split('\f');
      return parts.map((partText, idx) => ({
        pageNumber: idx + 1,
        text: partText,
      })).filter((p) => p.text.trim().length > 0);
    }

    // Partition continuous text into simulated pages (~1800 characters per page)
    const pageSize = 1800;
    const pages: ExtractedPage[] = [];
    let currentIdx = 0;
    let pageNum = 1;

    while (currentIdx < fullText.length) {
      const endIdx = Math.min(currentIdx + pageSize, fullText.length);
      const text = fullText.substring(currentIdx, endIdx);
      pages.push({ pageNumber: pageNum++, text });
      currentIdx = endIdx;
    }

    return pages.length > 0 ? pages : [{ pageNumber: 1, text: fullText }];
  }

  /**
   * STEP 2: Text Cleaning & Normalization
   */
  private static cleanText(raw: string): string {
    return raw
      .replace(/\0/g, '') // remove null bytes
      .replace(/\r\n/g, '\n') // normalize newline
      .replace(/(\w+)-\n(\w+)/g, '$1$2') // rejoin hyphenated words at line breaks
      .replace(/[ \t]+/g, ' ') // collapse multi-spaces
      .replace(/\n{3,}/g, '\n\n') // max 2 consecutive newlines
      .trim();
  }

  /**
   * STEP 3: Recursive Character Chunking with Overlap
   */
  private static chunkText(text: string, chunkSize: number, overlap: number): string[] {
    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
      let end = Math.min(start + chunkSize, text.length);

      // Try to break at a paragraph or sentence boundary if possible
      if (end < text.length) {
        const lastPeriod = text.lastIndexOf('.', end);
        const lastNewline = text.lastIndexOf('\n', end);
        const bestBreak = Math.max(lastPeriod, lastNewline);

        if (bestBreak > start + chunkSize * 0.5) {
          end = bestBreak + 1;
        }
      }

      const chunk = text.substring(start, end).trim();
      if (chunk) {
        chunks.push(chunk);
      }

      start = end - overlap;
      if (start >= text.length - overlap) {
        break;
      }
    }

    return chunks;
  }

  private static inferFileType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    return ext || 'txt';
  }
}

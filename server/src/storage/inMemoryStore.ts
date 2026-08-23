export interface IDocumentItem {
  documentId: string;
  datasetId: string;
  name: string;
  category: string;
  fileType: string;
  sizeBytes: number;
  chunksCount: number;
  trustScore: number;
  status: 'Indexed' | 'Processing' | 'Failed';
  createdAt: Date;
}

export interface IChunkItem {
  chunkId: string;
  documentId: string;
  datasetId: string;
  documentName: string;
  pageNumber: number;
  chunkIndex: number;
  text: string;
  embedding: number[];
  characterCount: number;
  metadata?: Record<string, any>;
  createdAt: Date;
}

class InMemoryStore {
  private documents: Map<string, IDocumentItem> = new Map();
  private chunks: Map<string, IChunkItem> = new Map();

  public saveDocument(doc: IDocumentItem): void {
    this.documents.set(doc.documentId, doc);
  }

  public getDocuments(datasetId?: string): IDocumentItem[] {
    const allDocs = Array.from(this.documents.values());
    if (datasetId && datasetId !== 'all') {
      return allDocs.filter((d) => d.datasetId === datasetId);
    }
    return allDocs;
  }

  public getDocumentById(documentId: string): IDocumentItem | undefined {
    return this.documents.get(documentId);
  }

  public deleteDocument(documentId: string): boolean {
    const deletedDoc = this.documents.delete(documentId);
    // Delete associated chunks
    for (const [chunkId, chunk] of this.chunks.entries()) {
      if (chunk.documentId === documentId) {
        this.chunks.delete(chunkId);
      }
    }
    return deletedDoc;
  }

  public saveChunks(chunks: IChunkItem[]): void {
    for (const chunk of chunks) {
      this.chunks.set(chunk.chunkId, chunk);
    }
  }

  public getAllChunks(): IChunkItem[] {
    return Array.from(this.chunks.values());
  }

  public getChunksByDatasetId(datasetId?: string): IChunkItem[] {
    const allChunks = Array.from(this.chunks.values());
    if (datasetId && datasetId !== 'all') {
      return allChunks.filter((c) => c.datasetId === datasetId);
    }
    return allChunks;
  }

  public clearAll(): void {
    this.documents.clear();
    this.chunks.clear();
  }
}

export const inMemoryStore = new InMemoryStore();

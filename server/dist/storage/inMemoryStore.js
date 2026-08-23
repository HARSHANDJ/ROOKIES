"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inMemoryStore = void 0;
class InMemoryStore {
    documents = new Map();
    chunks = new Map();
    saveDocument(doc) {
        this.documents.set(doc.documentId, doc);
    }
    getDocuments(datasetId) {
        const allDocs = Array.from(this.documents.values());
        if (datasetId && datasetId !== 'all') {
            return allDocs.filter((d) => d.datasetId === datasetId);
        }
        return allDocs;
    }
    getDocumentById(documentId) {
        return this.documents.get(documentId);
    }
    deleteDocument(documentId) {
        const deletedDoc = this.documents.delete(documentId);
        // Delete associated chunks
        for (const [chunkId, chunk] of this.chunks.entries()) {
            if (chunk.documentId === documentId) {
                this.chunks.delete(chunkId);
            }
        }
        return deletedDoc;
    }
    saveChunks(chunks) {
        for (const chunk of chunks) {
            this.chunks.set(chunk.chunkId, chunk);
        }
    }
    getAllChunks() {
        return Array.from(this.chunks.values());
    }
    getChunksByDatasetId(datasetId) {
        const allChunks = Array.from(this.chunks.values());
        if (datasetId && datasetId !== 'all') {
            return allChunks.filter((c) => c.datasetId === datasetId);
        }
        return allChunks;
    }
    clearAll() {
        this.documents.clear();
        this.chunks.clear();
    }
}
exports.inMemoryStore = new InMemoryStore();

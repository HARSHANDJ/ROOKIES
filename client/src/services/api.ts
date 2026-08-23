import type { 
  DocumentItem, 
  DatasetItem, 
  RetrievalResponse, 
  GroundedAnswerResult, 
  KnowledgeBoundaryData, 
  GraphTopologyData,
  SystemHealth 
} from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  /**
   * Health Check
   */
  async getHealth(): Promise<SystemHealth> {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return res.json();
  },

  /**
   * Fetch all indexed documents
   */
  async getDocuments(datasetId?: string): Promise<DocumentItem[]> {
    const url = datasetId ? `${API_BASE_URL}/documents?datasetId=${encodeURIComponent(datasetId)}` : `${API_BASE_URL}/documents`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch documents');
    const data = await res.json();
    
    return (data.documents || []).map((doc: any) => ({
      id: doc.documentId || doc._id || doc.id,
      documentId: doc.documentId || doc._id,
      datasetId: doc.datasetId,
      name: doc.name,
      category: doc.category || 'General',
      size: doc.sizeBytes ? `${(doc.sizeBytes / (1024 * 1024)).toFixed(2)} MB` : '0.5 MB',
      sizeBytes: doc.sizeBytes,
      status: doc.status || 'Indexed',
      trustScore: doc.trustScore || 100,
      uploadedAt: doc.createdAt ? new Date(doc.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      chunksCount: doc.chunksCount || 0,
      fileType: doc.fileType || 'txt',
    }));
  },

  /**
   * Upload Document File (PDF / TXT)
   */
  async uploadDocument(file: File, datasetId = 'academic-policy', category = 'General'): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('datasetId', datasetId);
    formData.append('category', category);

    const res = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || err.error || 'Failed to upload document');
    }

    return res.json();
  },

  /**
   * Process Raw Text Input
   */
  async processText(name: string, text: string, datasetId = 'academic-policy', category = 'General'): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/documents/process-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, text, datasetId, category }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || err.error || 'Failed to process text');
    }

    return res.json();
  },

  /**
   * Delete Document
   */
  async deleteDocument(documentId: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/documents/${encodeURIComponent(documentId)}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete document');
    return res.json();
  },

  /**
   * Fetch Datasets
   */
  async getDatasets(): Promise<DatasetItem[]> {
    const res = await fetch(`${API_BASE_URL}/documents/datasets`);
    if (!res.ok) throw new Error('Failed to fetch datasets');
    const data = await res.json();
    return (data.datasets || []).map((ds: any) => ({
      id: ds.id,
      title: ds.title,
      description: `Indexed document repository dataset containing ${ds.documentCount} documents and ${ds.chunkCount} vector chunks.`,
      documentCount: ds.documentCount,
      chunkCount: ds.chunkCount,
      tags: ['Vector-Indexed', 'Milestone 2', 'Grounding-Ready'],
      verified: true,
    }));
  },

  /**
   * Perform Semantic Retrieval Search
   */
  async searchKnowledge(question: string, datasetId = 'all', topK = 5): Promise<RetrievalResponse> {
    const res = await fetch(`${API_BASE_URL}/retrieval/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, datasetId, topK }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || err.error || 'Retrieval search failed');
    }

    return res.json();
  },

  /**
   * Conversational Grounded RAG Endpoint
   */
  async askChatQuestion(question: string, datasetId = 'all', topK = 5): Promise<GroundedAnswerResult> {
    const res = await fetch(`${API_BASE_URL}/chat/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, datasetId, topK }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || err.error || 'Grounded chat failed');
    }

    return res.json();
  },

  /**
   * Fetch Knowledge Boundary Categories
   */
  async getKnowledgeBoundary(): Promise<KnowledgeBoundaryData> {
    const res = await fetch(`${API_BASE_URL}/chat/boundary`);
    if (!res.ok) throw new Error('Failed to fetch knowledge boundary data');
    return res.json();
  },

  /**
   * Fetch Knowledge Graph Topology
   */
  async getKnowledgeGraphTopology(): Promise<GraphTopologyData> {
    const res = await fetch(`${API_BASE_URL}/graph/topology`);
    if (!res.ok) throw new Error('Failed to fetch knowledge graph topology');
    return res.json();
  },
};

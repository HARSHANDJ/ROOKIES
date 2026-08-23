export type DashboardTab =
  | 'overview'
  | 'ask'
  | 'documents'
  | 'datasets'
  | 'graph'
  | 'analytics'
  | 'eval-lab';

export interface DocumentItem {
  id: string;
  documentId?: string;
  datasetId?: string;
  name: string;
  category: string;
  size: string;
  sizeBytes?: number;
  status: 'Indexed' | 'Verifying' | 'Processing' | 'Failed';
  trustScore: number;
  uploadedAt: string;
  createdAt?: string;
  chunksCount: number;
  fileType?: string;
}

export interface DatasetItem {
  id: string;
  title: string;
  description: string;
  documentCount: number;
  chunkCount?: number;
  tags: string[];
  size?: string;
  verified: boolean;
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

export interface TrustMeterData {
  trustScore: number;
  relevancePercent: string;
  relevanceScore: number;
  evidenceStrength: 'Strong Evidence' | 'Moderate Evidence' | 'Insufficient Evidence';
  sourceCoverage: string;
  isGrounded: boolean;
}

export interface ConflictingSourceItem {
  documentId: string;
  documentName: string;
  pageNumber: number;
  chunkIndex: number;
  extractedClaim: string;
}

export interface ContradictionAlert {
  hasContradiction: boolean;
  conflictTitle: string;
  description: string;
  conflictCategory: 'Percentage Threshold' | 'Fee Rate' | 'Deadline Window' | 'Rule Statement' | 'None';
  sourceA?: ConflictingSourceItem;
  sourceB?: ConflictingSourceItem;
}

export interface ForensicsStep {
  stepNumber: number;
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'warning' | 'failed';
  details?: Record<string, any>;
}

export interface ForensicsLineage {
  question: string;
  datasetId: string;
  retrievedSourcesCount: number;
  chunksScanned: number;
  steps: ForensicsStep[];
  topChunks: SearchResultItem[];
}

export interface GroundedAnswerResult {
  question: string;
  answer: string;
  isKnown: boolean;
  trustMeter: TrustMeterData;
  contradictionAlert?: ContradictionAlert;
  sources: Array<{
    documentId: string;
    documentName: string;
    pageNumber: number;
    chunkIndex: number;
    similarityScore: number;
    scorePercent: string;
    textSnippet: string;
  }>;
  forensics: ForensicsLineage;
  embeddingProvider: string;
  searchMethod: string;
  latencyMs: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text?: string;
  groundedResult?: GroundedAnswerResult;
}

export interface KnowledgeBoundaryData {
  knows: Array<{
    topic: string;
    document: string;
    section: string;
    confidence: string;
    evidence: string;
  }>;
  partial: Array<{
    topic: string;
    document: string;
    section: string;
    confidence: string;
    evidence: string;
  }>;
  doesNotKnow: Array<{
    topic: string;
    reason: string;
  }>;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'document' | 'topic' | 'rule' | 'chunk';
  category?: string;
  details?: Record<string, any>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface GraphTopologyData {
  summary: {
    totalDocuments: number;
    totalTopics: number;
    totalRules: number;
    totalChunks: number;
    totalNodes: number;
    totalEdges: number;
  };
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface SystemHealth {
  status: string;
  brand?: string;
  tagline?: string;
  database: {
    isConnected: boolean;
    state: string;
    host?: string;
    name?: string;
    error?: string;
  };
}

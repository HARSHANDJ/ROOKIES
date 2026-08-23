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
  name: string;
  category: string;
  size: string;
  status: 'Indexed' | 'Verifying' | 'Failed';
  trustScore: number;
  uploadedAt: string;
  chunksCount: number;
}

export interface DatasetItem {
  id: string;
  title: string;
  description: string;
  documentCount: number;
  tags: string[];
  size: string;
  verified: boolean;
}

export interface SystemHealth {
  status: string;
  database: {
    isConnected: boolean;
    state: string;
    host?: string;
    name?: string;
    error?: string;
  };
}

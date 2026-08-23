import { Router, Request, Response, NextFunction } from 'express';
import { RetrievalService } from '../services/retrieval.service';

const router = Router();

/**
 * POST /api/retrieval/search
 * Semantic Vector Search Endpoint
 *
 * Input: { question: string, datasetId?: string, topK?: number }
 * Returns: { query, datasetId, results: [ { documentId, documentName, pageNumber, chunkIndex, text, similarityScore, scorePercent } ] }
 */
router.post('/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { question, datasetId, topK } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Search query string "question" is required' });
    }

    const response = await RetrievalService.search({
      question,
      datasetId: datasetId || 'all',
      topK: typeof topK === 'number' ? topK : 5,
    });

    res.status(200).json(response);
  } catch (err: any) {
    console.error('[Retrieval Route Error]', err);
    res.status(500).json({ error: 'Retrieval search failed', message: err.message });
  }
});

export default router;

import { Router, Request, Response } from 'express';
import { getDbStatus } from '../config/db';
import { config } from '../config/env';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  const dbStatus = getDbStatus();
  
  res.status(200).json({
    status: 'online',
    brand: 'KNOWSPHERE AI',
    tagline: 'Ask Anything. Trust Everything You Can Verify.',
    milestone: 'Milestone 1 Foundation',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    database: dbStatus,
  });
});

router.get('/status', (req: Request, res: Response) => {
  res.status(200).json({
    system: 'KnowSphere Engine Core',
    version: '1.0.0-m1',
    capabilities: {
      rag: 'Pending Milestone 2',
      vectorSearch: 'Pending Milestone 2',
      knowledgeGraph: 'Pending Milestone 3',
      analytics: 'Pending Milestone 4',
    },
  });
});

export default router;

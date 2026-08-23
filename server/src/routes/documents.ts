import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { DocumentProcessorService } from '../services/documentProcessor.service';
import { inMemoryStore } from '../storage/inMemoryStore';
import { DocumentModel } from '../models/Document';
import { ChunkModel } from '../models/Chunk';
import { getDbStatus } from '../config/db';

const router = Router();

// Configure Multer for in-memory file uploads (max 10MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

/**
 * POST /api/documents/upload
 * File Upload -> Text Extraction -> Cleaning -> Chunking -> Embeddings -> MongoDB
 */
router.post('/upload', upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file;
    const { datasetId, category } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'No file provided in form-data payload' });
    }

    const result = await DocumentProcessorService.processDocument({
      fileBuffer: file.buffer,
      fileName: file.originalname,
      fileType: file.mimetype.includes('pdf') ? 'pdf' : 'txt',
      datasetId: datasetId || 'default-dataset',
      category: category || 'General',
    });

    res.status(201).json({
      message: 'Document successfully processed and indexed into Knowledge Base',
      document: result,
    });
  } catch (err: any) {
    console.error('[Upload Endpoint Error]', err);
    res.status(500).json({ error: 'Failed to process document', message: err.message });
  }
});

/**
 * POST /api/documents/process-text
 * Process direct raw text input into document chunks & embeddings
 */
router.post('/process-text', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, text, datasetId, category } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Raw text content is required' });
    }

    const result = await DocumentProcessorService.processDocument({
      rawText: text,
      fileName: name || `Text-Snippet-${Date.now()}.txt`,
      fileType: 'txt',
      datasetId: datasetId || 'default-dataset',
      category: category || 'General',
    });

    res.status(201).json({
      message: 'Text successfully processed and indexed into Knowledge Base',
      document: result,
    });
  } catch (err: any) {
    console.error('[Process Text Error]', err);
    res.status(500).json({ error: 'Failed to process text', message: err.message });
  }
});

/**
 * GET /api/documents
 * List all processed documents
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const datasetId = req.query.datasetId as string;
    const dbStatus = getDbStatus();

    let documents: any[] = [];

    if (dbStatus.isConnected) {
      try {
        const filter: any = {};
        if (datasetId && datasetId !== 'all') {
          filter.datasetId = datasetId;
        }
        documents = await DocumentModel.find(filter).sort({ createdAt: -1 }).lean();
      } catch (dbErr) {
        console.warn('[Get Documents] MongoDB read failed, falling back to in-memory');
      }
    }

    if (documents.length === 0) {
      documents = inMemoryStore.getDocuments(datasetId);
    }

    res.status(200).json({
      count: documents.length,
      documents,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch documents', message: err.message });
  }
});

/**
 * DELETE /api/documents/:id
 * Delete document and associated vector chunks
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const documentId = req.params.id;
    const dbStatus = getDbStatus();

    inMemoryStore.deleteDocument(documentId);

    if (dbStatus.isConnected) {
      try {
        await DocumentModel.deleteOne({ documentId });
        await ChunkModel.deleteMany({ documentId });
      } catch (err: any) {
        console.warn(`[Delete Document] Mongo delete error: ${err.message}`);
      }
    }

    res.status(200).json({
      message: `Document ${documentId} and associated chunks deleted successfully`,
      documentId,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete document', message: err.message });
  }
});

/**
 * GET /api/datasets
 * List active datasets with metadata
 */
router.get('/datasets', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allDocs = inMemoryStore.getDocuments();
    const datasetMap = new Map<string, { count: number; chunks: number }>();

    for (const doc of allDocs) {
      const existing = datasetMap.get(doc.datasetId) || { count: 0, chunks: 0 };
      datasetMap.set(doc.datasetId, {
        count: existing.count + 1,
        chunks: existing.chunks + doc.chunksCount,
      });
    }

    const datasets = Array.from(datasetMap.entries()).map(([id, stats]) => ({
      id,
      title: id.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      documentCount: stats.count,
      chunkCount: stats.chunks,
    }));

    res.status(200).json({
      count: datasets.length,
      datasets,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch datasets', message: err.message });
  }
});

export default router;

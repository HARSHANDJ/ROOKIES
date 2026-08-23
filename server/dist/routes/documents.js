"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const documentProcessor_service_1 = require("../services/documentProcessor.service");
const inMemoryStore_1 = require("../storage/inMemoryStore");
const Document_1 = require("../models/Document");
const Chunk_1 = require("../models/Chunk");
const db_1 = require("../config/db");
const router = (0, express_1.Router)();
// Configure Multer for in-memory file uploads (max 10MB)
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
});
/**
 * POST /api/documents/upload
 * File Upload -> Text Extraction -> Cleaning -> Chunking -> Embeddings -> MongoDB
 */
router.post('/upload', upload.single('file'), async (req, res, next) => {
    try {
        const file = req.file;
        const { datasetId, category } = req.body;
        if (!file) {
            return res.status(400).json({ error: 'No file provided in form-data payload' });
        }
        const result = await documentProcessor_service_1.DocumentProcessorService.processDocument({
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
    }
    catch (err) {
        console.error('[Upload Endpoint Error]', err);
        res.status(500).json({ error: 'Failed to process document', message: err.message });
    }
});
/**
 * POST /api/documents/process-text
 * Process direct raw text input into document chunks & embeddings
 */
router.post('/process-text', async (req, res, next) => {
    try {
        const { name, text, datasetId, category } = req.body;
        if (!text || !text.trim()) {
            return res.status(400).json({ error: 'Raw text content is required' });
        }
        const result = await documentProcessor_service_1.DocumentProcessorService.processDocument({
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
    }
    catch (err) {
        console.error('[Process Text Error]', err);
        res.status(500).json({ error: 'Failed to process text', message: err.message });
    }
});
/**
 * GET /api/documents
 * List all processed documents
 */
router.get('/', async (req, res, next) => {
    try {
        const datasetId = req.query.datasetId;
        const dbStatus = (0, db_1.getDbStatus)();
        let documents = [];
        if (dbStatus.isConnected) {
            try {
                const filter = {};
                if (datasetId && datasetId !== 'all') {
                    filter.datasetId = datasetId;
                }
                documents = await Document_1.DocumentModel.find(filter).sort({ createdAt: -1 }).lean();
            }
            catch (dbErr) {
                console.warn('[Get Documents] MongoDB read failed, falling back to in-memory');
            }
        }
        if (documents.length === 0) {
            documents = inMemoryStore_1.inMemoryStore.getDocuments(datasetId);
        }
        res.status(200).json({
            count: documents.length,
            documents,
        });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch documents', message: err.message });
    }
});
/**
 * DELETE /api/documents/:id
 * Delete document and associated vector chunks
 */
router.delete('/:id', async (req, res, next) => {
    try {
        const documentId = req.params.id;
        const dbStatus = (0, db_1.getDbStatus)();
        inMemoryStore_1.inMemoryStore.deleteDocument(documentId);
        if (dbStatus.isConnected) {
            try {
                await Document_1.DocumentModel.deleteOne({ documentId });
                await Chunk_1.ChunkModel.deleteMany({ documentId });
            }
            catch (err) {
                console.warn(`[Delete Document] Mongo delete error: ${err.message}`);
            }
        }
        res.status(200).json({
            message: `Document ${documentId} and associated chunks deleted successfully`,
            documentId,
        });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to delete document', message: err.message });
    }
});
/**
 * GET /api/datasets
 * List active datasets with metadata
 */
router.get('/datasets', async (req, res, next) => {
    try {
        const allDocs = inMemoryStore_1.inMemoryStore.getDocuments();
        const datasetMap = new Map();
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
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch datasets', message: err.message });
    }
});
exports.default = router;

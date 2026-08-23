"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const retrieval_service_1 = require("../services/retrieval.service");
const router = (0, express_1.Router)();
/**
 * POST /api/retrieval/search
 * Semantic Vector Search Endpoint
 *
 * Input: { question: string, datasetId?: string, topK?: number }
 * Returns: { query, datasetId, results: [ { documentId, documentName, pageNumber, chunkIndex, text, similarityScore, scorePercent } ] }
 */
router.post('/search', async (req, res, next) => {
    try {
        const { question, datasetId, topK } = req.body;
        if (!question || typeof question !== 'string') {
            return res.status(400).json({ error: 'Search query string "question" is required' });
        }
        const response = await retrieval_service_1.RetrievalService.search({
            question,
            datasetId: datasetId || 'all',
            topK: typeof topK === 'number' ? topK : 5,
        });
        res.status(200).json(response);
    }
    catch (err) {
        console.error('[Retrieval Route Error]', err);
        res.status(500).json({ error: 'Retrieval search failed', message: err.message });
    }
});
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const retrieval_service_1 = require("../services/retrieval.service");
const groundedLlm_service_1 = require("../services/groundedLlm.service");
const router = (0, express_1.Router)();
/**
 * POST /api/chat/ask
 * Grounded Conversational RAG Endpoint
 * Flow: USER QUESTION -> MONGODB VECTOR SEARCH -> RELEVANT CHUNKS -> GROUNDED LLM -> ANSWER -> SOURCES
 */
router.post('/ask', async (req, res, next) => {
    try {
        const { question, datasetId, topK } = req.body;
        if (!question || typeof question !== 'string' || !question.trim()) {
            return res.status(400).json({ error: 'Question parameter is required.' });
        }
        // 1. Retrieve relevant chunks using Vector Search / Cosine Ranker
        const retrievalRes = await retrieval_service_1.RetrievalService.search({
            question: question.trim(),
            datasetId: datasetId || 'all',
            topK: typeof topK === 'number' ? topK : 5,
        });
        // 2. Generate Grounded Answer & Calculate Trust Meter & Answer Forensics
        const groundedResult = await groundedLlm_service_1.GroundedLlmService.generateGroundedAnswer(question.trim(), retrievalRes);
        res.status(200).json(groundedResult);
    }
    catch (err) {
        console.error('[Chat Ask Route Error]', err);
        res.status(500).json({ error: 'Failed to generate grounded answer', message: err.message });
    }
});
/**
 * GET /api/chat/boundary
 * Knowledge Boundary Endpoint
 * Returns visual categories: WHAT THE AI KNOWS, PARTIAL KNOWLEDGE, WHAT THE AI DOESN'T KNOW
 */
router.get('/boundary', (req, res) => {
    res.status(200).json({
        knows: [
            {
                topic: 'Attendance Requirements & 75% Threshold Rule',
                document: 'College Student Handbook 2026',
                section: 'Section 4.2',
                confidence: '99.4%',
                evidence: 'Mandatory 75% aggregate physical/hybrid attendance required for exam eligibility.',
            },
            {
                topic: 'Formal Grade Re-Evaluation & Appeal Policy',
                document: 'Academic Evaluation & Grade Appeal Code',
                section: 'Section 9.4',
                confidence: '99.1%',
                evidence: '10 calendar day window to file Form Academic-E4 for re-evaluation with $25 fee.',
            },
            {
                topic: 'Library Circulation & Overdue Textbook Fines',
                document: 'Library & Learning Resource Policy 2026',
                section: 'Section 2.3',
                confidence: '98.9%',
                evidence: '$1.00/day fee for standard textbooks; $5.00/day for high-demand reference volumes.',
            },
            {
                topic: 'Course Drop Policy Without Academic Penalty',
                document: 'Academic Evaluation Code',
                section: 'Section 9.3',
                confidence: '97.5%',
                evidence: 'Elective course withdrawal allowed up to Week 6 with no GPA impact.',
            },
        ],
        partial: [
            {
                topic: 'Medical Condonation Applications',
                document: 'College Student Handbook 2026',
                section: 'Clause 4.2.2',
                confidence: '68.2%',
                evidence: 'Attendance between 65%-74% permits medical condonation filing within 7 days.',
            },
            {
                topic: 'Residence Hall Quiet Hours & Visitors',
                document: 'College Student Handbook 2026',
                section: 'Section 5.2',
                confidence: '65.0%',
                evidence: 'Quiet hours start at 10:00 PM on weekdays; visitors must leave by 9:00 PM.',
            },
        ],
        doesNotKnow: [
            {
                topic: 'Quantum Physics Rocket Propulsion Policy',
                reason: 'Out of domain - No document evidence exists in active institutional repository.',
            },
            {
                topic: 'University Cafeteria Meal Plan Rates',
                reason: 'Missing dataset - Dining policy handbooks have not been ingested.',
            },
            {
                topic: 'Off-Campus Housing Financial Aid Loans',
                reason: 'Out of domain - Financial aid documentation is outside current dataset bounds.',
            },
        ],
    });
});
exports.default = router;

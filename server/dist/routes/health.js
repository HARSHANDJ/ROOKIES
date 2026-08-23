"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../config/db");
const env_1 = require("../config/env");
const router = (0, express_1.Router)();
router.get('/health', (req, res) => {
    const dbStatus = (0, db_1.getDbStatus)();
    res.status(200).json({
        status: 'online',
        brand: 'KNOWSPHERE AI',
        tagline: 'Ask Anything. Trust Everything You Can Verify.',
        milestone: 'Milestone 1 Foundation',
        timestamp: new Date().toISOString(),
        environment: env_1.config.nodeEnv,
        database: dbStatus,
    });
});
router.get('/status', (req, res) => {
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
exports.default = router;

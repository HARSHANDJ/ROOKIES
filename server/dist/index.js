"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const db_1 = require("./config/db");
const health_1 = __importDefault(require("./routes/health"));
const documents_1 = __importDefault(require("./routes/documents"));
const retrieval_1 = __importDefault(require("./routes/retrieval"));
const chat_1 = __importDefault(require("./routes/chat"));
const graph_1 = __importDefault(require("./routes/graph"));
const seedService_1 = require("./services/seedService");
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({ origin: '*' }));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Request logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
// Routes
app.use('/api', health_1.default);
app.use('/api/documents', documents_1.default);
app.use('/api/retrieval', retrieval_1.default);
app.use('/api/chat', chat_1.default);
app.use('/api/graph', graph_1.default);
// Base route
app.get('/', (req, res) => {
    res.json({
        message: 'KnowSphere AI Backend Service Operational',
        healthCheck: '/api/health',
        statusCheck: '/api/status',
        documentsApi: '/api/documents',
        retrievalApi: '/api/retrieval/search',
    });
});
// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});
// Global Error Handler
app.use((err, req, res, next) => {
    console.error('[KnowSphere Server Error]', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});
// Start Server & DB Connection
const startServer = async () => {
    await (0, db_1.connectDB)();
    // Seed default sample documents if needed
    await (0, seedService_1.seedSampleKnowledgeBase)();
    app.listen(env_1.config.port, () => {
        console.log(`==================================================`);
        console.log(`⚡ KNOWSPHERE AI SERVER RUNNING ON PORT ${env_1.config.port}`);
        console.log(`   Health Check: http://localhost:${env_1.config.port}/api/health`);
        console.log(`   Documents API: http://localhost:${env_1.config.port}/api/documents`);
        console.log(`   Retrieval API: http://localhost:${env_1.config.port}/api/retrieval/search`);
        console.log(`   Environment: ${env_1.config.nodeEnv}`);
        console.log(`==================================================`);
    });
};
startServer();

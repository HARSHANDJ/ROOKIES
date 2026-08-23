import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config/env';
import { connectDB } from './config/db';
import healthRoutes from './routes/health';

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Request logger
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api', healthRoutes);

// Base route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'KnowSphere AI Backend Service Operational',
    healthCheck: '/api/health',
    statusCheck: '/api/status',
  });
});

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[KnowSphere Server Error]', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start Server & DB Connection
const startServer = async () => {
  await connectDB();
  
  app.listen(config.port, () => {
    console.log(`==================================================`);
    console.log(`⚡ KNOWSPHERE AI SERVER RUNNING ON PORT ${config.port}`);
    console.log(`   Health Check: http://localhost:${config.port}/api/health`);
    console.log(`   Environment: ${config.nodeEnv}`);
    console.log(`==================================================`);
  });
};

startServer();

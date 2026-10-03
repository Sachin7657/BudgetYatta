import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import dns from 'node:dns/promises';
import tripRoutes from './routes/trip.routes.js';
import { getDbConnectionStatus } from './config/database.js';

dotenv.config();

// Custom DNS servers to prevent querySrv ECONNREFUSED on Windows
dns.setServers(['1.1.1.1', '1.0.0.1']);

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
];

if (process.env.CLIENT_URL) {
  // Add production client origin
  allowedOrigins.push(process.env.CLIENT_URL.trim());
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: '1mb' }));

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  const dbStatus = getDbConnectionStatus();
  res.status(200).json({
    success: true,
    status: 'ok',
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// Trip routes
app.use('/api/trips', tripRoutes);

// Catch 404 for unknown API routes
app.use('/api/*', (_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'API endpoint not found',
    },
  });
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled Server Error:', err?.message || err);
  res.status(500).json({
    success: false,
    error: {
      message: err?.message || 'Internal server error',
    },
  });
});

export default app;

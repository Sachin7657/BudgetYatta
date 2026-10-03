import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import dns from 'node:dns/promises';
import tripRoutes from './routes/trip.routes.js';
import { connectToDatabase, getDbConnectionStatus } from './config/database.js';

dotenv.config();

// Custom DNS servers to prevent querySrv ECONNREFUSED on Windows local dev
try {
  dns.setServers(['1.1.1.1', '1.0.0.1']);
} catch {
  // Ignore DNS setServers errors on serverless platforms (e.g. Vercel)
}

const app = express();

const helmetFn = typeof helmet === 'function' ? helmet : ((helmet as any).default || helmet);
app.use(
  helmetFn({
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
  allowedOrigins.push(process.env.CLIENT_URL.trim());
}

const corsFn = typeof cors === 'function' ? cors : ((cors as any).default || cors);
app.use(
  corsFn({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
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
app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    await connectToDatabase();
  } catch {
    // If DB fails to connect, getDbConnectionStatus will return disconnected
  }
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

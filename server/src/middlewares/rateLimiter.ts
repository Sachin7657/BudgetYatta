import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  timestamps: number[];
}

const ipRequestMap = new Map<string, RateLimitRecord>();

export const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
export const MAX_REQUESTS = 3; // Max 3 requests per 10 minutes

/**
 * Extracts client IP address accurately, handling proxy headers (e.g., Vercel, Nginx, Cloudflare).
 */
export function getClientIp(req: Request): string {
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (xForwardedFor) {
    const ips = Array.isArray(xForwardedFor) ? xForwardedFor[0] : xForwardedFor.split(',')[0];
    if (ips) return ips.trim();
  }
  return (req.headers['x-real-ip'] as string) || req.ip || req.socket?.remoteAddress || '127.0.0.1';
}

/**
 * Resets rate limit memory store (useful for tests and maintenance).
 */
export function resetRateLimits(): void {
  ipRequestMap.clear();
}

// Periodically clean up stale records every 5 minutes
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipRequestMap.entries()) {
    record.timestamps = record.timestamps.filter((t) => now - t < WINDOW_MS);
    if (record.timestamps.length === 0) {
      ipRequestMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

if (cleanupInterval.unref) {
  cleanupInterval.unref();
}

/**
 * Rate limiting middleware for AI trip generation endpoints.
 * Enforces a strict limit of 3 requests per 10-minute window per IP.
 */
export function aiRateLimiter(req: Request, res: Response, next: NextFunction): void {
  const clientIp = getClientIp(req);
  const now = Date.now();

  const record = ipRequestMap.get(clientIp) || { timestamps: [] };

  // Keep only timestamps within the current 10-minute sliding window
  record.timestamps = record.timestamps.filter((t) => now - t < WINDOW_MS);

  if (record.timestamps.length >= MAX_REQUESTS) {
    const oldestRequest = record.timestamps[0];
    const timeToWaitMs = oldestRequest + WINDOW_MS - now;
    const retryAfterSeconds = Math.max(1, Math.ceil(timeToWaitMs / 1000));
    const retryAfterMinutes = Math.ceil(retryAfterSeconds / 60);

    res.setHeader('Retry-After', retryAfterSeconds.toString());
    res.setHeader('X-RateLimit-Limit', MAX_REQUESTS.toString());
    res.setHeader('X-RateLimit-Remaining', '0');
    res.setHeader('X-RateLimit-Reset', Math.ceil((oldestRequest + WINDOW_MS) / 1000).toString());

    res.status(429).json({
      success: false,
      error: {
        message: `AI generation limit reached (max 3 trips per 10 minutes per IP). Please wait about ${retryAfterMinutes} minute(s) before generating another trip.`,
      },
    });
    return;
  }

  // Record valid request
  record.timestamps.push(now);
  ipRequestMap.set(clientIp, record);

  const remaining = MAX_REQUESTS - record.timestamps.length;
  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS.toString());
  res.setHeader('X-RateLimit-Remaining', remaining.toString());

  next();
}

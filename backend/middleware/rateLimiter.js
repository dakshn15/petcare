import rateLimit from 'express-rate-limit';

// Global rate limiter: 1000 requests per 10 minutes
export const globalLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 1000,
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Auth-specific rate limiter: 10 attempts per 10 minutes
// Only counts failed attempts (skipSuccessfulRequests: true)
export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

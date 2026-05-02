const rateLimit = require('express-rate-limit');
const logger = require('../config/logger');

/**
 * Rate limiter for API routes
 * Prevents abuse and DDoS attacks
 */
const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req) => {
    // Use user ID if authenticated, otherwise use IP
    return req.session?.user?._id || req.ip;
  },
  skip: (req) => {
    // Skip rate limiting for health check
    return req.path === '/health';
  },
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for ${req.ip}`);
    res.status(429).json({
      success: false,
      statusCode: 429,
      message: 'Too many requests, please try again later',
    });
  },
});

/**
 * Strict rate limiter for login attempts
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many login attempts, please try again after 15 minutes',
  skipSuccessfulRequests: true, // Don't count successful requests
});

module.exports = {
  rateLimiter,
  loginLimiter,
};

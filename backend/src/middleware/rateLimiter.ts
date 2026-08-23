import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests created from this IP. Please try again after 15 minutes.',
    },
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // Limit auth attempts to 30 per 15 minutes
  message: {
    success: false,
    error: {
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      message: 'Too many authentication attempts. Please try again later.',
    },
  },
});

export const simulationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // Limit quantum simulations to 60 per minute
  message: {
    success: false,
    error: {
      code: 'SIMULATION_RATE_LIMIT_EXCEEDED',
      message: 'Quantum simulator capacity limit reached. Please wait a few seconds.',
    },
  },
});

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { env } from './config/env';
import { logger } from './config/logger';
import { connectDatabase } from './models';
import { connectRedis } from './config/redis';
import { apiLimiter } from './middleware/rateLimiter';
import { sanitizeData, sanitizeInput, preventParameterPollution } from './middleware/sanitize';

const app = express();

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));

// CORS Configuration
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 600, // 10 minutes
}));

// Compression
app.use(compression());

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sanitization
app.use(sanitizeData);
app.use(sanitizeInput);
app.use(preventParameterPollution);

// Rate limiting for all API routes
app.use(`${env.API_PREFIX}`, apiLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Import routes
import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';
import landingRoutes from './routes/landingRoutes';

// API routes
app.get(env.API_PREFIX, (req, res) => {
  res.json({
    message: 'AI Exam Platform API',
    version: '1.0.0',
    docs: `${env.API_PREFIX}/docs`,
  });
});

app.use(`${env.API_PREFIX}/auth`, authRoutes);
app.use(`${env.API_PREFIX}/courses`, courseRoutes);
app.use(`${env.API_PREFIX}/landing`, landingRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error({ err, path: req.path }, 'Unhandled error');
  res.status(500).json({
    success: false,
    error: env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

const startServer = async () => {
  try {
    // Try to connect to database (non-blocking)
    try {
      await connectDatabase();
    } catch (dbError) {
      logger.warn({ error: dbError }, 'Database connection failed - server will start without DB');
    }
    
    // Try to connect to Redis (non-blocking)
    try {
      await connectRedis();
    } catch (redisError) {
      logger.warn({ error: redisError }, 'Redis connection failed - server will start without Redis');
    }
    
    // Start server
    const PORT = parseInt(env.PORT);
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📚 API available at http://localhost:${PORT}${env.API_PREFIX}`);
      logger.info(`🏥 Health check at http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
};

startServer();

import { createClient } from 'redis';
import { env } from './env';
import { logger } from './logger';

// Use REDIS_URL if available (Railway format), otherwise use host/port
const redisConfig = process.env.REDIS_URL 
  ? { url: process.env.REDIS_URL }
  : {
      socket: {
        host: env.REDIS_HOST,
        port: parseInt(env.REDIS_PORT) || 6379,
      },
    };

export const redisClient = createClient(redisConfig);

redisClient.on('error', (err) => {
  logger.error({ err }, 'Redis connection error');
});

redisClient.on('connect', () => {
  logger.info('Redis connected successfully');
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    logger.error({ error }, 'Failed to connect to Redis');
    throw error;
  }
};

import { Queue, Worker, Job } from 'bullmq';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { aiGradingService } from './aiGradingService';
import { getWebSocketService } from './websocketService';

// Redis connection config
const connection = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
};

// Create queues
export const gradingQueue = new Queue('grading', { connection });
export const notificationQueue = new Queue('notifications', { connection });

// Grading worker
const gradingWorker = new Worker(
  'grading',
  async (job: Job) => {
    const { studentExamId, userId } = job.data;
    
    logger.info({ jobId: job.id, studentExamId }, 'Processing grading job');

    try {
      const result = await aiGradingService.gradeExam(studentExamId);

      // Emit WebSocket event
      try {
        const ws = getWebSocketService();
        ws.emitGradingComplete(userId, {
          studentExamId,
          score: result.score,
          totalPoints: result.totalPoints,
          feedback: result.feedback,
        });
      } catch (wsError) {
        logger.warn('WebSocket not available, skipping real-time notification');
      }

      logger.info({ jobId: job.id, studentExamId, score: result.score }, 'Grading job completed');
      
      return result;
    } catch (error) {
      logger.error({ error, jobId: job.id, studentExamId }, 'Grading job failed');
      throw error;
    }
  },
  {
    connection,
    concurrency: 5, // Process 5 jobs concurrently
  }
);

// Notification worker
const notificationWorker = new Worker(
  'notifications',
  async (job: Job) => {
    const { type, userId, data } = job.data;
    
    logger.info({ jobId: job.id, type, userId }, 'Processing notification job');

    try {
      // Emit WebSocket notification
      try {
        const ws = getWebSocketService();
        ws.emitNotification(userId, {
          type,
          data,
          timestamp: new Date(),
        });
      } catch (wsError) {
        logger.warn('WebSocket not available, skipping real-time notification');
      }

      // TODO: Send email/SMS notification here
      
      logger.info({ jobId: job.id, type, userId }, 'Notification job completed');
    } catch (error) {
      logger.error({ error, jobId: job.id }, 'Notification job failed');
      throw error;
    }
  },
  {
    connection,
    concurrency: 10,
  }
);

// Worker event handlers
gradingWorker.on('completed', (job) => {
  logger.info({ jobId: job.id }, 'Grading worker completed job');
});

gradingWorker.on('failed', (job, error) => {
  logger.error({ jobId: job?.id, error }, 'Grading worker failed job');
});

notificationWorker.on('completed', (job) => {
  logger.info({ jobId: job.id }, 'Notification worker completed job');
});

notificationWorker.on('failed', (job, error) => {
  logger.error({ jobId: job?.id, error }, 'Notification worker failed job');
});

// Helper functions
export const addGradingJob = async (studentExamId: number, userId: number) => {
  const job = await gradingQueue.add(
    'grade-exam',
    { studentExamId, userId },
    {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    }
  );
  
  logger.info({ jobId: job.id, studentExamId }, 'Grading job added to queue');
  return job;
};

export const addNotificationJob = async (userId: number, type: string, data: any) => {
  const job = await notificationQueue.add(
    'send-notification',
    { userId, type, data },
    {
      attempts: 2,
      backoff: {
        type: 'fixed',
        delay: 5000,
      },
    }
  );
  
  logger.info({ jobId: job.id, userId, type }, 'Notification job added to queue');
  return job;
};

logger.info('Queue service initialized');

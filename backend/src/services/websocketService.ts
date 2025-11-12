import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { logger } from '../config/logger';
import EventEmitter from 'events';

export const aiEventEmitter = new EventEmitter();
export const systemEventEmitter = new EventEmitter();
export const analyticsEventEmitter = new EventEmitter();

export class WebSocketService {
  private io: SocketIOServer;

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
      },
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    // Optional: Authentication middleware for secure connections
    // For now, allowing connections for real-time analytics
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: Socket) => {
      logger.info({ socketId: socket.id }, 'WebSocket client connected');

      // Join admin room for real-time updates
      socket.on('join_admin', () => {
        socket.join('admin_room');
        logger.info({ socketId: socket.id }, 'Admin joined real-time dashboard');
      });

      // AI log listener
      const aiLogHandler = (log: any) => {
        this.io.to('admin_room').emit('ai_log_update', log);
      };

      // System log listener
      const systemLogHandler = (log: any) => {
        this.io.to('admin_room').emit('system_log_update', log);
      };

      // Analytics listener
      const analyticsHandler = (event: any) => {
        this.io.to('admin_room').emit('analytics_update', event);
      };

      // Live stats updater (every 5 seconds)
      const statsInterval = setInterval(async () => {
        try {
          const liveStats = await this.getLiveStats();
          this.io.to('admin_room').emit('live_stats_update', liveStats);
        } catch (error) {
          logger.error({ error }, 'Failed to fetch live stats');
        }
      }, 5000);

      // Register event listeners
      aiEventEmitter.on('ai_log', aiLogHandler);
      systemEventEmitter.on('system_log', systemLogHandler);
      analyticsEventEmitter.on('analytics_event', analyticsHandler);

      // Handle disconnection
      socket.on('disconnect', () => {
        logger.info({ socketId: socket.id }, 'WebSocket client disconnected');
        clearInterval(statsInterval);
        aiEventEmitter.off('ai_log', aiLogHandler);
        systemEventEmitter.off('system_log', systemLogHandler);
        analyticsEventEmitter.off('analytics_event', analyticsHandler);
      });

      // Handle ping
      socket.on('ping', () => {
        socket.emit('pong');
      });
    });
  }

  // Helper to get live stats
  private async getLiveStats() {
    try {
      // Dynamic import to avoid circular dependency
      const models = await import('../models');
      const { User, Exam, AILog, SystemLog, AnalyticsEvent } = models;
      
      const [totalUsers, totalExams, todayAnalytics, recentAILogs, recentSystemLogs] = await Promise.all([
        User.count(),
        Exam.count(),
        AnalyticsEvent.count({
          where: {
            timestamp: {
              $gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        }),
        AILog.findAll({ limit: 5, order: [['createdAt', 'DESC']] }),
        SystemLog.findAll({ limit: 5, order: [['timestamp', 'DESC']] }),
      ]);

      return {
        totalUsers,
        totalExams,
        todayAnalytics,
        recentAILogs,
        recentSystemLogs,
        timestamp: new Date(),
      };
    } catch (error) {
      logger.error({ error }, 'Error fetching live stats');
      return {
        totalUsers: 0,
        totalExams: 0,
        todayAnalytics: 0,
        recentAILogs: [],
        recentSystemLogs: [],
        timestamp: new Date(),
      };
    }
  }

  // Emit AI log event
  public emitAILog(log: any) {
    this.io.to('admin_room').emit('ai_log_update', log);
    aiEventEmitter.emit('ai_log', log);
  }

  // Emit system log event
  public emitSystemLog(log: any) {
    this.io.to('admin_room').emit('system_log_update', log);
    systemEventEmitter.emit('system_log', log);
  }

  // Emit analytics event
  public emitAnalyticsEvent(event: any) {
    this.io.to('admin_room').emit('analytics_update', event);
    analyticsEventEmitter.emit('analytics_event', event);
  }

  // Emit notification to specific user
  public emitNotification(userId: number, notification: any) {
    this.io.to(`user:${userId}`).emit('notification', notification);
  }

  // Emit exam availability
  public emitExamAvailable(classId: number, exam: any) {
    this.io.to(`class:${classId}`).emit('exam:available', exam);
  }

  // Emit grading complete
  public emitGradingComplete(userId: number, result: any) {
    this.io.to(`user:${userId}`).emit('grading:complete', result);
  }

  // Get Socket.IO instance
  public getIO(): SocketIOServer {
    return this.io;
  }
}

let websocketService: WebSocketService | null = null;

export const initializeWebSocket = (httpServer: HTTPServer): WebSocketService => {
  websocketService = new WebSocketService(httpServer);
  logger.info('WebSocket service initialized');
  return websocketService;
};

export const getWebSocketService = (): WebSocketService => {
  if (!websocketService) {
    throw new Error('WebSocket service not initialized');
  }
  return websocketService;
};

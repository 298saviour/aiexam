import { Request, Response } from 'express';
import { logger } from '../config/logger';
import { Op } from 'sequelize';

export const getAnalyticsStats = async (req: Request, res: Response) => {
  try {
    // Dynamic import to avoid circular dependency
    const { User, Exam, Course, AILog, SystemLog, AnalyticsEvent } = await import('../models');

    const { startDate, endDate } = req.query;
    
    const dateFilter = startDate && endDate ? {
      createdAt: {
        [Op.between]: [new Date(startDate as string), new Date(endDate as string)],
      },
    } : {};

    const [
      totalUsers,
      totalExams,
      totalCourses,
      totalAILogs,
      totalSystemLogs,
      totalAnalyticsEvents,
      recentAILogs,
      recentSystemLogs,
      usersByRole,
      examsByStatus,
    ] = await Promise.all([
      User.count(dateFilter ? { where: dateFilter } : {}),
      Exam.count(dateFilter ? { where: dateFilter } : {}),
      Course.count(dateFilter ? { where: dateFilter } : {}),
      AILog.count(dateFilter ? { where: dateFilter } : {}),
      SystemLog.count(dateFilter ? { where: { timestamp: dateFilter.createdAt } } : {}),
      AnalyticsEvent.count(dateFilter ? { where: { timestamp: dateFilter.createdAt } } : {}),
      AILog.findAll({ limit: 10, order: [['createdAt', 'DESC']] }),
      SystemLog.findAll({ limit: 10, order: [['timestamp', 'DESC']] }),
      User.findAll({
        attributes: ['role', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        group: ['role'],
        raw: true,
      }),
      Exam.findAll({
        attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        group: ['status'],
        raw: true,
      }),
    ]);

    // Calculate AI grading stats
    const aiGradingStats = await AILog.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['status'],
      raw: true,
    });

    // Get analytics events by type
    const analyticsEventsByType = await AnalyticsEvent.findAll({
      attributes: [
        'eventType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['eventType'],
      raw: true,
    });

    // Get daily analytics for charts
    const dailyAnalytics = await AnalyticsEvent.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('timestamp')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      where: {
        timestamp: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
      group: [sequelize.fn('DATE', sequelize.col('timestamp'))],
      order: [[sequelize.fn('DATE', sequelize.col('timestamp')), 'ASC']],
      raw: true,
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalExams,
          totalCourses,
          totalAILogs,
          totalSystemLogs,
          totalAnalyticsEvents,
        },
        recentActivity: {
          aiLogs: recentAILogs,
          systemLogs: recentSystemLogs,
        },
        breakdowns: {
          usersByRole,
          examsByStatus,
          aiGradingStats,
          analyticsEventsByType,
        },
        charts: {
          dailyAnalytics,
        },
      },
    });
  } catch (error) {
    logger.error({ error }, 'Get analytics stats error');
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics stats',
    });
  }
};

export const getAILogs = async (req: Request, res: Response) => {
  try {
    const { AILog } = await import('../models');
    const { page = 1, limit = 50, status, eventType } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    
    const where: any = {};
    if (status) where.status = status;
    if (eventType) where.eventType = eventType;

    const { rows: logs, count } = await AILog.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: logs,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (error) {
    logger.error({ error }, 'Get AI logs error');
    res.status(500).json({
      success: false,
      error: 'Failed to fetch AI logs',
    });
  }
};

export const getSystemLogs = async (req: Request, res: Response) => {
  try {
    const { SystemLog } = await import('../models');
    const { page = 1, limit = 50, action, actorRole } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    
    const where: any = {};
    if (action) where.action = action;
    if (actorRole) where.actorRole = actorRole;

    const { rows: logs, count } = await SystemLog.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order: [['timestamp', 'DESC']],
    });

    res.json({
      success: true,
      data: logs,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (error) {
    logger.error({ error }, 'Get system logs error');
    res.status(500).json({
      success: false,
      error: 'Failed to fetch system logs',
    });
  }
};

export const getAnalyticsEvents = async (req: Request, res: Response) => {
  try {
    const { AnalyticsEvent } = await import('../models');
    const { page = 1, limit = 50, eventType } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    
    const where: any = {};
    if (eventType) where.eventType = eventType;

    const { rows: events, count } = await AnalyticsEvent.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order: [['timestamp', 'DESC']],
    });

    res.json({
      success: true,
      data: events,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (error) {
    logger.error({ error }, 'Get analytics events error');
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics events',
    });
  }
};

export const exportLogs = async (req: Request, res: Response) => {
  try {
    const { AILog, SystemLog, AnalyticsEvent } = await import('../models');
    const { type = 'all', format = 'csv', startDate, endDate } = req.query;

    const dateFilter = startDate && endDate ? {
      createdAt: {
        [Op.between]: [new Date(startDate as string), new Date(endDate as string)],
      },
    } : {};

    let logs: any[] = [];

    if (type === 'ai' || type === 'all') {
      const aiLogs = await AILog.findAll({
        where: dateFilter,
        order: [['createdAt', 'DESC']],
        limit: 1000,
      });
      logs = [...logs, ...aiLogs.map(log => ({ ...log.toJSON(), logType: 'AI' }))];
    }

    if (type === 'system' || type === 'all') {
      const systemLogs = await SystemLog.findAll({
        where: { timestamp: dateFilter.createdAt },
        order: [['timestamp', 'DESC']],
        limit: 1000,
      });
      logs = [...logs, ...systemLogs.map(log => ({ ...log.toJSON(), logType: 'System' }))];
    }

    if (type === 'analytics' || type === 'all') {
      const analyticsEvents = await AnalyticsEvent.findAll({
        where: { timestamp: dateFilter.createdAt },
        order: [['timestamp', 'DESC']],
        limit: 1000,
      });
      logs = [...logs, ...analyticsEvents.map(event => ({ ...event.toJSON(), logType: 'Analytics' }))];
    }

    if (format === 'csv') {
      // Generate CSV
      const headers = Object.keys(logs[0] || {}).join(',');
      const rows = logs.map(log => Object.values(log).map(v => `"${v}"`).join(',')).join('\n');
      const csv = `${headers}\n${rows}`;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=logs-${Date.now()}.csv`);
      res.send(csv);
    } else {
      // JSON format
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=logs-${Date.now()}.json`);
      res.json({ logs, exportedAt: new Date(), total: logs.length });
    }
  } catch (error) {
    logger.error({ error }, 'Export logs error');
    res.status(500).json({
      success: false,
      error: 'Failed to export logs',
    });
  }
};

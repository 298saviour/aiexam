import { Request, Response } from 'express';
import { logger } from '../config/logger';

export const trackAnalyticsEvent = async (req: Request, res: Response) => {
  try {
    const { event, source, metadata } = req.body;
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ip = req.ip || req.socket.remoteAddress || 'Unknown';
    const referer = req.headers['referer'] || 'Direct';

    // Validate event type
    const validEvents = [
      'landing_page_visit',
      'hero_cta_click',
      'pricing_view',
      'contact_form_open',
      'demo_video_play',
      'signup_click',
      'login_click',
      'feature_card_hover',
    ];

    if (event && !validEvents.includes(event)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid event type',
      });
    }

    // Log analytics event
    logger.info({
      event: 'analytics_event',
      eventType: event,
      source,
      metadata,
      ip,
      userAgent,
      referer,
      timestamp: new Date(),
    }, `Analytics: ${event} from ${source}`);

    // TODO: Save to database when models are fixed
    // await AnalyticsEvent.create({
    //   event,
    //   source,
    //   metadata,
    //   userAgent,
    //   ip,
    //   referer,
    //   timestamp: new Date(),
    // });

    res.status(200).json({
      success: true,
      message: 'Event tracked successfully',
    });
  } catch (error) {
    logger.error({ error }, 'Analytics tracking error');
    res.status(500).json({
      success: false,
      error: 'Failed to track analytics event',
    });
  }
};

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, eventType } = req.query;

    // TODO: Fetch from database when models are fixed
    // const events = await AnalyticsEvent.findAll({
    //   where: {
    //     timestamp: {
    //       [Op.between]: [startDate || new Date(0), endDate || new Date()],
    //     },
    //     ...(eventType && { event: eventType }),
    //   },
    //   order: [['timestamp', 'DESC']],
    // });

    const events: any[] = [];

    // Calculate statistics
    const stats = {
      totalEvents: events.length,
      uniqueVisitors: new Set(events.map((e: any) => e.ip)).size,
      eventBreakdown: events.reduce((acc: any, e: any) => {
        acc[e.event] = (acc[e.event] || 0) + 1;
        return acc;
      }, {}),
      topSources: events.reduce((acc: any, e: any) => {
        acc[e.source] = (acc[e.source] || 0) + 1;
        return acc;
      }, {}),
    };

    // Time series data (group by day)
    const timeSeries = events.reduce((acc: any, e: any) => {
      const date = new Date(e.timestamp).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      data: events,
      stats,
      timeSeries,
    });
  } catch (error) {
    logger.error({ error }, 'Get analytics error');
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics',
    });
  }
};

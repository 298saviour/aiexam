import { Request, Response } from 'express';
import { logger } from '../config/logger';

export const trackCookieConsent = async (req: Request, res: Response) => {
  try {
    const { consent } = req.body;
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ip = req.ip || req.socket.remoteAddress || 'Unknown';

    // Log cookie consent
    logger.info({
      event: 'cookie_consent',
      consent,
      ip,
      userAgent,
      timestamp: new Date(),
    }, `Cookie consent: ${consent ? 'accepted' : 'declined'}`);

    // TODO: Save to database when models are fixed
    // await CookieConsent.create({
    //   consent,
    //   userAgent,
    //   ip,
    //   timestamp: new Date(),
    // });

    res.status(200).json({
      success: true,
      accepted: consent,
      message: consent ? 'Cookie consent accepted' : 'Cookie consent declined',
    });
  } catch (error) {
    logger.error({ error }, 'Cookie consent tracking error');
    res.status(500).json({
      success: false,
      error: 'Failed to track cookie consent',
    });
  }
};

export const getCookieConsents = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    // TODO: Fetch from database when models are fixed
    // const consents = await CookieConsent.findAll({
    //   where: {
    //     timestamp: {
    //       [Op.between]: [startDate || new Date(0), endDate || new Date()],
    //     },
    //   },
    //   order: [['timestamp', 'DESC']],
    // });

    const consents: any[] = [];

    // Calculate statistics
    const stats = {
      total: consents.length,
      accepted: consents.filter((c: any) => c.consent).length,
      declined: consents.filter((c: any) => !c.consent).length,
      acceptanceRate: consents.length > 0 
        ? ((consents.filter((c: any) => c.consent).length / consents.length) * 100).toFixed(2)
        : 0,
    };

    res.json({
      success: true,
      data: consents,
      stats,
    });
  } catch (error) {
    logger.error({ error }, 'Get cookie consents error');
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cookie consents',
    });
  }
};

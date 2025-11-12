import { Request, Response } from 'express';
import { logger } from '../config/logger';
import nodemailer from 'nodemailer';
import { body, validationResult } from 'express-validator';

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_SERVER || 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

// Validation middleware
export const validateContact = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ min: 10, max: 1000 }),
];

export const submitContact = async (req: Request, res: Response) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { name, email, message } = req.body;
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ip = req.ip || req.socket.remoteAddress || 'Unknown';

    // Log the contact submission
    logger.info({
      event: 'contact_submission',
      name,
      email,
      ip,
      userAgent,
    }, 'New contact form submission');

    // TODO: Save to database when models are fixed
    // await ContactSubmission.create({
    //   name,
    //   email,
    //   message,
    //   userAgent,
    //   ip,
    //   submittedAt: new Date(),
    // });

    // Send email notification to admin
    try {
      await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: process.env.ADMIN_EMAIL || 'admin@aiexamplatform.com',
        subject: '📬 New Contact Form Submission - AI Exam Platform',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1E40AF;">New Contact Submission</h2>
            <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>IP Address:</strong> ${ip}</p>
              <p><strong>User Agent:</strong> ${userAgent}</p>
            </div>
            <div style="background: #FFFFFF; padding: 20px; border-left: 4px solid #1E40AF; margin: 20px 0;">
              <h3 style="margin-top: 0;">Message:</h3>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
            <p style="color: #6B7280; font-size: 12px;">
              Received at: ${new Date().toLocaleString()}
            </p>
          </div>
        `,
        text: `
New Contact Submission

Name: ${name}
Email: ${email}
IP: ${ip}

Message:
${message}

Received at: ${new Date().toLocaleString()}
        `,
      });

      logger.info({ email }, 'Contact notification email sent to admin');
    } catch (emailError) {
      logger.error({ error: emailError }, 'Failed to send contact notification email');
      // Don't fail the request if email fails
    }

    res.status(200).json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.',
    });
  } catch (error) {
    logger.error({ error }, 'Contact form submission error');
    res.status(500).json({
      success: false,
      error: 'Failed to submit contact form. Please try again later.',
    });
  }
};

export const getContactSubmissions = async (req: Request, res: Response) => {
  try {
    // TODO: Fetch from database when models are fixed
    // const submissions = await ContactSubmission.findAll({
    //   order: [['submittedAt', 'DESC']],
    //   limit: 100,
    // });

    const submissions: any[] = [];

    res.json({
      success: true,
      data: submissions,
      count: submissions.length,
    });
  } catch (error) {
    logger.error({ error }, 'Get contact submissions error');
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contact submissions',
    });
  }
};

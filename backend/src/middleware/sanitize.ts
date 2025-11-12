import { Request, Response, NextFunction } from 'express';
import mongoSanitize from 'express-mongo-sanitize';

// Sanitize request data to prevent NoSQL injection
export const sanitizeData = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`Sanitized key: ${key} in request from ${req.ip}`);
  },
});

// Remove any potentially dangerous characters from strings
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Sanitize body
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === 'string') {
        // Remove script tags and other dangerous patterns
        req.body[key] = req.body[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '');
      }
    });
  }

  // Sanitize query params
  if (req.query) {
    Object.keys(req.query).forEach((key) => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = (req.query[key] as string)
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '');
      }
    });
  }

  next();
};

// Prevent parameter pollution
export const preventParameterPollution = (req: Request, res: Response, next: NextFunction) => {
  // Convert arrays to single values for specific parameters
  const singleValueParams = ['id', 'email', 'role', 'page', 'limit'];
  
  if (req.query) {
    singleValueParams.forEach((param) => {
      if (Array.isArray(req.query[param])) {
        req.query[param] = req.query[param][0];
      }
    });
  }
  
  next();
};

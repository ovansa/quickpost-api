import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { db } from '../database';
import { AuthRequest } from '../types';
import { logger } from '../utils/logger';

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      logger.warn('Auth', 'Request rejected — no token provided', {
        method: req.method,
        path: req.originalUrl,
        ip: req.ip,
      });
      res.status(401).json({
        error: 'Access denied',
        message: 'No token provided. Include Authorization header with Bearer token.',
      });
      return;
    }

    jwt.verify(token, config.jwtSecret, (err: any, decoded: any) => {
      if (err) {
        logger.warn('Auth', `Token verification failed — ${err.name}`, {
          method: req.method,
          path: req.originalUrl,
          ip: req.ip,
          error: err.name,
        });

        if (err.name === 'TokenExpiredError') {
          res.status(401).json({ error: 'Token expired', message: 'Please login again.' });
        } else if (err.name === 'JsonWebTokenError') {
          res.status(401).json({ error: 'Invalid token', message: 'Token format is invalid.' });
        } else {
          res.status(401).json({ error: 'Token verification failed', message: err.message });
        }
        return;
      }

      const user = db.findUserById(decoded.id);
      if (!user) {
        logger.warn('Auth', 'Token valid but user not found', { userId: decoded.id });
        res.status(401).json({ error: 'User not found', message: 'Token user does not exist.' });
        return;
      }

      logger.debug('Auth', 'Token verified successfully', { userId: user.id, username: user.username });

      req.user = { id: user.id, username: user.username, email: user.email };
      next();
    });
  } catch (error: any) {
    logger.error('Auth', 'Unexpected authentication error', { error: error.message });
    res.status(500).json({ error: 'Internal server error', message: 'Authentication failed.' });
  }
};

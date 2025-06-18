import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { db } from '../database';
import { AuthRequest } from '../types';

export const authenticateToken = (
	req: AuthRequest,
	res: Response,
	next: NextFunction
): void => {
	try {
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];

		if (!token) {
			res.status(401).json({
				error: 'Access denied',
				message:
					'No token provided. Include Authorization header with Bearer token.',
			});
			return;
		}

		jwt.verify(token, config.jwtSecret, (err: any, decoded: any) => {
			if (err) {
				if (err.name === 'TokenExpiredError') {
					res
						.status(401)
						.json({ error: 'Token expired', message: 'Please login again.' });
				} else if (err.name === 'JsonWebTokenError') {
					res.status(401).json({
						error: 'Invalid token',
						message: 'Token format is invalid.',
					});
				} else {
					res
						.status(401)
						.json({ error: 'Token verification failed', message: err.message });
				}
				return;
			}

			const user = db.findUserById(decoded.id);
			if (!user) {
				res.status(401).json({
					error: 'User not found',
					message: 'Token user does not exist.',
				});
				return;
			}

			req.user = {
				id: user.id,
				username: user.username,
				email: user.email,
			};
			next();
		});
	} catch (error) {
		console.error('Authentication middleware error:', error);
		res.status(500).json({
			error: 'Internal server error',
			message: 'Authentication failed.',
		});
	}
};

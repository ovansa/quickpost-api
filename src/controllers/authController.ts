import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { createUserResponse } from '../utils/helpers';

export class AuthController {
	async register(req: Request, res: Response) {
		try {
			const { username, email, password } = req.body;
			const { user, token } = await authService.register(
				username,
				email,
				password
			);

			res.status(201).json({
				message: 'User registered successfully',
				user: createUserResponse(user),
				token,
			});
		} catch (error: any) {
			res.status(error.statusCode || 500).json({
				error: error.statusCode ? 'Validation error' : 'Internal server error',
				message: error.message || 'Failed to register user.',
			});
		}
	}

	async login(req: Request, res: Response) {
		try {
			const { username, password } = req.body;
			const { user, token } = await authService.login(username, password);

			res.json({
				message: 'Login successful',
				user: createUserResponse(user),
				token,
			});
		} catch (error: any) {
			res.status(error.statusCode || 500).json({
				error: error.statusCode
					? 'Authentication error'
					: 'Internal server error',
				message: error.message || 'Failed to login.',
			});
		}
	}
}

export const authController = new AuthController();

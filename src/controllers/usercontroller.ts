import { Response } from 'express';
import { db } from '../database';
import { AuthRequest } from '../types';
import { createUserResponse } from '../utils/helpers';

export class UserController {
	getUsers(req: AuthRequest, res: Response) {
		try {
			const users = db.getUsers();
			const userResponses = users.map(createUserResponse);

			res.json({
				users: userResponses,
				total: userResponses.length,
			});
		} catch (error) {
			res.status(500).json({
				error: 'Internal server error',
				message: 'Failed to fetch users.',
			});
		}
	}

	getUserById(req: AuthRequest, res: Response) {
		try {
			const id = parseInt(req.params.id);

			if (isNaN(id)) {
				res.status(400).json({
					error: 'Invalid user ID',
					message: 'User ID must be a valid number.',
				});
				return;
			}

			const user = db.findUserById(id);
			if (!user) {
				res.status(404).json({
					error: 'User not found',
					message: `User with ID ${id} does not exist.`,
				});
				return;
			}

			res.json({ user: createUserResponse(user) });
		} catch (error) {
			res.status(500).json({
				error: 'Internal server error',
				message: 'Failed to fetch user.',
			});
		}
	}
}

export const userController = new UserController();

import { Request } from 'express';

export interface User {
	id: number;
	username: string;
	email: string;
	password: string;
	createdAt: Date;
}

export interface Post {
	id: number;
	title: string;
	content: string;
	authorId: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface AuthRequest extends Request {
	user?: {
		id: number;
		username: string;
		email: string;
	};
}

export interface ApiError extends Error {
	statusCode?: number;
}

import { Request, Response } from 'express';
import { db } from '../database';
import { postService } from '../services/postService';
import { AuthRequest } from '../types';
import { createPostWithAuthor } from '../utils/helpers';

export class PostController {
	getPosts(req: Request, res: Response) {
		try {
			const page = parseInt(req.query.page as string) || 1;
			const limit = parseInt(req.query.limit as string) || 10;
			const authorId = req.query.authorId
				? parseInt(req.query.authorId as string)
				: undefined;

			if (authorId && isNaN(authorId)) {
				res.status(400).json({
					error: 'Invalid author ID',
					message: 'Author ID must be a valid number.',
				});
				return;
			}

			const result = postService.getPosts(page, limit, authorId);
			const users = db.getUsers();

			const postsWithAuthor = result.posts.map((post) =>
				createPostWithAuthor(post, users)
			);

			res.json({
				posts: postsWithAuthor,
				pagination: result.pagination,
			});
		} catch (error) {
			res.status(500).json({
				error: 'Internal server error',
				message: 'Failed to fetch posts.',
			});
		}
	}

	getPostById(req: Request, res: Response) {
		try {
			const id = parseInt(req.params.id);

			if (isNaN(id)) {
				res.status(400).json({
					error: 'Invalid post ID',
					message: 'Post ID must be a valid number.',
				});
				return;
			}

			const post = postService.getPostById(id);
			if (!post) {
				res.status(404).json({
					error: 'Post not found',
					message: `Post with ID ${id} does not exist.`,
				});
				return;
			}

			const users = db.getUsers();
			const postWithAuthor = createPostWithAuthor(post, users);

			res.json({ post: postWithAuthor });
		} catch (error) {
			res.status(500).json({
				error: 'Internal server error',
				message: 'Failed to fetch post.',
			});
		}
	}

	createPost(req: AuthRequest, res: Response) {
		try {
			const { title, content } = req.body;
			const newPost = postService.createPost(title, content, req.user!.id);

			const postWithAuthor = {
				...newPost,
				author: { username: req.user!.username, email: req.user!.email },
			};

			res.status(201).json({
				message: 'Post created successfully',
				post: postWithAuthor,
			});
		} catch (error: any) {
			res.status(error.statusCode || 500).json({
				error: error.statusCode ? 'Validation error' : 'Internal server error',
				message: error.message || 'Failed to create post.',
			});
		}
	}

	updatePost(req: AuthRequest, res: Response) {
		try {
			const id = parseInt(req.params.id);
			const { title, content } = req.body;

			if (isNaN(id)) {
				res.status(400).json({
					error: 'Invalid post ID',
					message: 'Post ID must be a valid number.',
				});
				return;
			}

			const updatedPost = postService.updatePost(
				id,
				title,
				content,
				req.user!.id
			);

			const postWithAuthor = {
				...updatedPost,
				author: { username: req.user!.username, email: req.user!.email },
			};

			res.json({
				message: 'Post updated successfully',
				post: postWithAuthor,
			});
		} catch (error: any) {
			res.status(error.statusCode || 500).json({
				error: error.statusCode ? 'Validation error' : 'Internal server error',
				message: error.message || 'Failed to update post.',
			});
		}
	}

	deletePost(req: AuthRequest, res: Response) {
		try {
			const id = parseInt(req.params.id);

			if (isNaN(id)) {
				res.status(400).json({
					error: 'Invalid post ID',
					message: 'Post ID must be a valid number.',
				});
				return;
			}

			const deletedPost = postService.deletePost(id, req.user!.id);

			res.json({
				message: 'Post deleted successfully',
				deletedPost,
			});
		} catch (error: any) {
			res.status(error.statusCode || 500).json({
				error: error.statusCode ? 'Validation error' : 'Internal server error',
				message: error.message || 'Failed to delete post.',
			});
		}
	}
}

export const postController = new PostController();

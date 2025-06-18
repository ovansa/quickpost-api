import { db } from '../database';
import { Post } from '../types';

export class PostService {
	getPosts(page: number = 1, limit: number = 10, authorId?: number) {
		let posts = db.getPosts();

		if (authorId) {
			posts = db.getPostsByAuthor(authorId);
		}

		const startIndex = (page - 1) * limit;
		const endIndex = startIndex + limit;
		const paginatedPosts = posts.slice(startIndex, endIndex);

		return {
			posts: paginatedPosts,
			pagination: {
				page,
				limit,
				total: posts.length,
				totalPages: Math.ceil(posts.length / limit),
			},
		};
	}

	getPostById(id: number): Post | null {
		return db.findPostById(id) || null;
	}

	createPost(title: string, content: string, authorId: number): Post {
		if (!title || !content) {
			throw { statusCode: 400, message: 'Title and content are required.' };
		}

		if (title.length < 3) {
			throw {
				statusCode: 400,
				message: 'Title must be at least 3 characters long.',
			};
		}

		if (content.length < 10) {
			throw {
				statusCode: 400,
				message: 'Content must be at least 10 characters long.',
			};
		}

		return db.createPost({
			title: title.trim(),
			content: content.trim(),
			authorId,
		});
	}

	updatePost(id: number, title: string, content: string, userId: number): Post {
		const post = db.findPostById(id);
		if (!post) {
			throw { statusCode: 404, message: `Post with ID ${id} does not exist.` };
		}

		if (post.authorId !== userId) {
			throw { statusCode: 403, message: 'You can only edit your own posts.' };
		}

		if (!title || !content) {
			throw { statusCode: 400, message: 'Title and content are required.' };
		}

		if (title.length < 3) {
			throw {
				statusCode: 400,
				message: 'Title must be at least 3 characters long.',
			};
		}

		if (content.length < 10) {
			throw {
				statusCode: 400,
				message: 'Content must be at least 10 characters long.',
			};
		}

		const updatedPost = db.updatePost(id, {
			title: title.trim(),
			content: content.trim(),
		});

		if (!updatedPost) {
			throw { statusCode: 500, message: 'Failed to update post.' };
		}

		return updatedPost;
	}

	deletePost(id: number, userId: number): { id: number; title: string } {
		const post = db.findPostById(id);
		if (!post) {
			throw { statusCode: 404, message: `Post with ID ${id} does not exist.` };
		}

		if (post.authorId !== userId) {
			throw { statusCode: 403, message: 'You can only delete your own posts.' };
		}

		const success = db.deletePost(id);
		if (!success) {
			throw { statusCode: 500, message: 'Failed to delete post.' };
		}

		return { id: post.id, title: post.title };
	}
}

export const postService = new PostService();

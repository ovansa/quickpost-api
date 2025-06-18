import bcrypt from 'bcryptjs';
import { config } from '../config';
import { Post, User } from '../types';

class InMemoryDatabase {
	private users: User[] = [];
	private posts: Post[] = [];
	private userIdCounter = 1;
	private postIdCounter = 1;

	async initializeMockData(): Promise<void> {
		try {
			const hashedPassword = await bcrypt.hash(
				'password123',
				config.saltRounds
			);

			this.users = [
				{
					id: this.userIdCounter++,
					username: 'john_doe',
					email: 'john@example.com',
					password: hashedPassword,
					createdAt: new Date('2024-01-01'),
				},
				{
					id: this.userIdCounter++,
					username: 'jane_smith',
					email: 'jane@example.com',
					password: hashedPassword,
					createdAt: new Date('2024-01-02'),
				},
				{
					id: this.userIdCounter++,
					username: 'bob_wilson',
					email: 'bob@example.com',
					password: hashedPassword,
					createdAt: new Date('2024-01-03'),
				},
			];

			this.posts = [
				{
					id: this.postIdCounter++,
					title: 'Getting Started with APIs',
					content:
						'This is a comprehensive guide to understanding REST APIs and how to work with them effectively.',
					authorId: 1,
					createdAt: new Date('2024-01-05'),
					updatedAt: new Date('2024-01-05'),
				},
				{
					id: this.postIdCounter++,
					title: 'Authentication Best Practices',
					content:
						'Learn about JWT tokens, password hashing, and secure authentication patterns.',
					authorId: 1,
					createdAt: new Date('2024-01-06'),
					updatedAt: new Date('2024-01-06'),
				},
				{
					id: this.postIdCounter++,
					title: 'Testing Your API',
					content:
						'A guide to testing REST APIs using various tools and frameworks.',
					authorId: 2,
					createdAt: new Date('2024-01-07'),
					updatedAt: new Date('2024-01-07'),
				},
			];

			console.log('Mock data initialized successfully');
		} catch (error) {
			console.error('Failed to initialize mock data:', error);
			throw error;
		}
	}

	getUsers(): User[] {
		return this.users;
	}

	findUserById(id: number): User | undefined {
		return this.users.find((u) => u.id === id);
	}

	findUserByUsernameOrEmail(identifier: string): User | undefined {
		return this.users.find(
			(u) => u.username === identifier || u.email === identifier
		);
	}

	createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
		const newUser: User = {
			id: this.userIdCounter++,
			...userData,
			createdAt: new Date(),
		};
		this.users.push(newUser);
		return newUser;
	}

	getPosts(): Post[] {
		return this.posts;
	}

	findPostById(id: number): Post | undefined {
		return this.posts.find((p) => p.id === id);
	}

	getPostsByAuthor(authorId: number): Post[] {
		return this.posts.filter((p) => p.authorId === authorId);
	}

	createPost(postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Post {
		const newPost: Post = {
			id: this.postIdCounter++,
			...postData,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		this.posts.push(newPost);
		return newPost;
	}

	updatePost(
		id: number,
		updates: Partial<Pick<Post, 'title' | 'content'>>
	): Post | null {
		const index = this.posts.findIndex((p) => p.id === id);
		if (index === -1) return null;

		this.posts[index] = {
			...this.posts[index],
			...updates,
			updatedAt: new Date(),
		};
		return this.posts[index];
	}

	deletePost(id: number): boolean {
		const index = this.posts.findIndex((p) => p.id === id);
		if (index === -1) return false;

		this.posts.splice(index, 1);
		return true;
	}

	reset(): void {
		this.users = [];
		this.posts = [];
		this.userIdCounter = 1;
		this.postIdCounter = 1;
	}
}

export const db = new InMemoryDatabase();

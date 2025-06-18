import { User } from '../types';

export const createUserResponse = (user: User) => ({
	id: user.id,
	username: user.username,
	email: user.email,
	createdAt: user.createdAt,
});

export const createPostWithAuthor = (post: any, users: User[]) => {
	const author = users.find((u) => u.id === post.authorId);
	return {
		...post,
		author: author ? { username: author.username, email: author.email } : null,
	};
};

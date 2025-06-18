export const validateEmail = (email: string): boolean => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
	if (!password) return false;
	return password.length >= 6;
};

export const validateUsername = (username: string): boolean => {
	if (!username || typeof username !== 'string') return false;
	return username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
};

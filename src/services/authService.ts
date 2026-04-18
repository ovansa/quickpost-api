import {
  validateEmail,
  validatePassword,
  validateUsername,
} from '../utils/validation';

import bcrypt from 'bcryptjs';
import { config } from '../config';
import { db } from '../database';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

export class AuthService {
  async register(username: string, email: string, password: string) {
    // Validation
    if (!username || !email || !password) {
      throw {
        statusCode: 400,
        message: 'Username, email, and password are required.',
      };
    }

    if (!validateUsername(username)) {
      throw {
        statusCode: 400,
        message:
          'Username must be at least 3 characters long and contain only letters, numbers, and underscores.',
      };
    }

    if (!validateEmail(email)) {
      throw {
        statusCode: 400,
        message: 'Please provide a valid email address.',
      };
    }

    if (!validatePassword(password)) {
      throw {
        statusCode: 400,
        message: 'Password must be at least 6 characters long.',
      };
    }

    const existingUser =
      db.findUserByUsernameOrEmail(username) ||
      db.findUserByUsernameOrEmail(email);
    if (existingUser) {
      logger.warn('AuthService', 'Registration failed — username or email already taken', { username, email });
      throw { statusCode: 409, message: 'Username or email is already taken.' };
    }

    const hashedPassword = await bcrypt.hash(password, config.saltRounds);
    const newUser = db.createUser({ username, email, password: hashedPassword });

    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    logger.info('AuthService', 'User registered successfully', { userId: newUser.id, username, email });
    return { user: newUser, token };
  }

  async login(username: string, password: string) {
    if (!username || !password) {
      throw { statusCode: 400, message: 'Username and password are required.' };
    }

    const user = db.findUserByUsernameOrEmail(username);
    if (!user) {
      logger.warn('AuthService', 'Login failed — user not found', { username });
      throw { statusCode: 401, message: 'Username or password is incorrect.' };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      logger.warn('AuthService', 'Login failed — incorrect password', { username, userId: user.id });
      throw { statusCode: 401, message: 'Username or password is incorrect.' };
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    logger.info('AuthService', 'User logged in successfully', { userId: user.id, username });
    return { user, token };
  }
}

export const authService = new AuthService();

import {
  validateEmail,
  validatePassword,
  validateUsername,
} from '../utils/validation';

import bcrypt from 'bcryptjs';
import { config } from '../config';
import { db } from '../database';
import jwt from 'jsonwebtoken';

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

    // Check if user exists
    const existingUser =
      db.findUserByUsernameOrEmail(username) ||
      db.findUserByUsernameOrEmail(email);
    if (existingUser) {
      throw { statusCode: 409, message: 'Username or email is already taken.' };
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, config.saltRounds);
    const newUser = db.createUser({
      username,
      email,
      password: hashedPassword,
    });

    // Generate token
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    return { user: newUser, token };
  }

  async login(username: string, password: string) {
    if (!username || !password) {
      throw { statusCode: 400, message: 'Username and password are required.' };
    }

    const user = db.findUserByUsernameOrEmail(username);
    if (!user) {
      throw { statusCode: 401, message: 'Username or password is incorrect.' };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw { statusCode: 401, message: 'Username or password is incorrect.' };
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    return { user, token };
  }
}

export const authService = new AuthService();

const port = process.env.PORT || 4000;
const host = process.env.HOST || 'localhost';

export const config = {
  port,
  host,
  serverUrl: process.env.SERVER_URL || `http://${host}:${port}`,
  jwtSecret:
    process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  saltRounds: 10,
  nodeEnv: process.env.NODE_ENV || 'development',
};

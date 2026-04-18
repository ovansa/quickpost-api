export const config = {
  port: process.env.PORT || 4000,
  jwtSecret:
    process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  saltRounds: 10,
  nodeEnv: process.env.NODE_ENV || 'development',
};

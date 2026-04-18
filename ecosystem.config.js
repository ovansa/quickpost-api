module.exports = {
  apps: [
    {
      name: 'quickpost-api',
      script: 'dist/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
        SERVER_URL: 'http://192.168.1.7:4000',
      },
    },
  ],
};

import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './config';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'QuickPost API',
      version: '1.0.0',
      description: 'A lightweight educational REST API for learning and testing',
    },
    servers: [{ url: config.serverUrl }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            username: { type: 'string' },
            email: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Post: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            content: { type: 'string' },
            authorId: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    paths: {
      '/health': {
        get: {
          summary: 'Health check',
          tags: ['Utility'],
          responses: {
            '200': { description: 'Server is healthy' },
          },
        },
      },
      '/reset': {
        post: {
          summary: 'Reset all data to mock defaults',
          tags: ['Utility'],
          responses: {
            '200': { description: 'Data reset successfully' },
          },
        },
      },
      '/auth/register': {
        post: {
          summary: 'Register a new user',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['username', 'email', 'password'],
                  properties: {
                    username: { type: 'string', example: 'jane_doe' },
                    email: { type: 'string', example: 'jane@example.com' },
                    password: { type: 'string', example: 'secret123' },
                  },
                },
              },
            },
          },
          responses: {
            '201': { description: 'User registered successfully' },
            '400': { description: 'Validation error' },
          },
        },
      },
      '/auth/login': {
        post: {
          summary: 'Login and receive a JWT token',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['username', 'password'],
                  properties: {
                    username: { type: 'string', example: 'john_doe' },
                    password: { type: 'string', example: 'password123' },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Login successful, returns JWT token' },
            '401': { description: 'Invalid credentials' },
          },
        },
      },
      '/users': {
        get: {
          summary: 'Get all users',
          tags: ['Users'],
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'List of users',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/User' } },
                },
              },
            },
            '401': { description: 'Unauthorized' },
          },
        },
      },
      '/users/{id}': {
        get: {
          summary: 'Get user by ID',
          tags: ['Users'],
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            '200': { description: 'User found' },
            '404': { description: 'User not found' },
          },
        },
      },
      '/posts': {
        get: {
          summary: 'Get all posts',
          tags: ['Posts'],
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          ],
          responses: {
            '200': {
              description: 'List of posts',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/Post' } },
                },
              },
            },
          },
        },
        post: {
          summary: 'Create a new post',
          tags: ['Posts'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'content'],
                  properties: {
                    title: { type: 'string', example: 'My first post' },
                    content: { type: 'string', example: 'Hello world!' },
                  },
                },
              },
            },
          },
          responses: {
            '201': { description: 'Post created' },
            '401': { description: 'Unauthorized' },
          },
        },
      },
      '/posts/{id}': {
        get: {
          summary: 'Get post by ID',
          tags: ['Posts'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            '200': { description: 'Post found' },
            '404': { description: 'Post not found' },
          },
        },
        put: {
          summary: 'Update a post',
          tags: ['Posts'],
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    content: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Post updated' },
            '401': { description: 'Unauthorized' },
            '404': { description: 'Post not found' },
          },
        },
        delete: {
          summary: 'Delete a post',
          tags: ['Posts'],
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            '200': { description: 'Post deleted' },
            '401': { description: 'Unauthorized' },
            '404': { description: 'Post not found' },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);

# QuickPost API

A lightweight, educational REST API built with Node.js, Express, and TypeScript. Perfect for learning API testing, practicing HTTP requests, or teaching REST API concepts.

## 🎯 Purpose

This API is designed specifically for educational purposes, providing:

- A realistic API structure with authentication
- Sample data to work with immediately
- Clear error messages and validation
- No database setup required (uses in-memory storage)
- Perfect for API testing tutorials and workshops

## ✨ Features

- **JWT Authentication** - Secure login system with token-based auth
- **User Management** - Registration and user data endpoints
- **Blog Posts** - CRUD operations for posts with author relationships
- **Comprehensive Validation** - Input validation with helpful error messages
- **Pagination** - Built-in pagination for posts
- **Mock Data** - Pre-loaded with sample users and posts
- **CORS Enabled** - Ready for frontend integration
- **TypeScript** - Fully typed for better development experience

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- pnpm (recommended) or npm/yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd quickpost-api

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Or build and start production server
pnpm build
pnpm start
```

The API will be available at `http://localhost:3000`

### Test the API

```bash
# Check if the server is running
curl http://localhost:3000/health

# Get API documentation
curl http://localhost:3000/

# Login with test credentials
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","password":"password123"}'
```

## 📚 API Documentation

### Base URL

```
http://localhost:3000
```

### Authentication

Most endpoints require a JWT token. Include it in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication Endpoints

### Register User

**POST** `/auth/register`

Register a new user account.

**Request Body:**

```json
{
	"username": "string (min 3 chars, alphanumeric + underscore)",
	"email": "string (valid email format)",
	"password": "string (min 6 chars)"
}
```

**Response (201):**

```json
{
	"message": "User registered successfully",
	"user": {
		"id": 1,
		"username": "john_doe",
		"email": "john@example.com",
		"createdAt": "2024-01-01T00:00:00.000Z"
	},
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login User

**POST** `/auth/login`

Authenticate a user and receive a JWT token.

**Request Body:**

```json
{
	"username": "string (username or email)",
	"password": "string"
}
```

**Response (200):**

```json
{
	"message": "Login successful",
	"user": {
		"id": 1,
		"username": "john_doe",
		"email": "john@example.com",
		"createdAt": "2024-01-01T00:00:00.000Z"
	},
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 👥 User Endpoints

### Get All Users

**GET** `/users` 🔒

Get a list of all registered users (requires authentication).

**Response (200):**

```json
{
	"users": [
		{
			"id": 1,
			"username": "john_doe",
			"email": "john@example.com",
			"createdAt": "2024-01-01T00:00:00.000Z"
		}
	],
	"total": 1
}
```

### Get User by ID

**GET** `/users/:id` 🔒

Get a specific user by their ID (requires authentication).

**Response (200):**

```json
{
	"user": {
		"id": 1,
		"username": "john_doe",
		"email": "john@example.com",
		"createdAt": "2024-01-01T00:00:00.000Z"
	}
}
```

---

## 📝 Post Endpoints

### Get All Posts

**GET** `/posts`

Get all posts with pagination and optional filtering.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Posts per page (default: 10)
- `authorId` (optional): Filter posts by author ID

**Response (200):**

```json
{
	"posts": [
		{
			"id": 1,
			"title": "Getting Started with APIs",
			"content": "This is a comprehensive guide...",
			"authorId": 1,
			"createdAt": "2024-01-05T00:00:00.000Z",
			"updatedAt": "2024-01-05T00:00:00.000Z",
			"author": {
				"username": "john_doe",
				"email": "john@example.com"
			}
		}
	],
	"pagination": {
		"page": 1,
		"limit": 10,
		"total": 3,
		"totalPages": 1
	}
}
```

### Get Post by ID

**GET** `/posts/:id`

Get a specific post by its ID.

**Response (200):**

```json
{
	"post": {
		"id": 1,
		"title": "Getting Started with APIs",
		"content": "This is a comprehensive guide...",
		"authorId": 1,
		"createdAt": "2024-01-05T00:00:00.000Z",
		"updatedAt": "2024-01-05T00:00:00.000Z",
		"author": {
			"username": "john_doe",
			"email": "john@example.com"
		}
	}
}
```

### Create Post

**POST** `/posts` 🔒

Create a new post (requires authentication).

**Request Body:**

```json
{
	"title": "string (min 3 chars)",
	"content": "string (min 10 chars)"
}
```

**Response (201):**

```json
{
	"message": "Post created successfully",
	"post": {
		"id": 4,
		"title": "My New Post",
		"content": "This is the content of my new post...",
		"authorId": 1,
		"createdAt": "2024-01-08T00:00:00.000Z",
		"updatedAt": "2024-01-08T00:00:00.000Z",
		"author": {
			"username": "john_doe",
			"email": "john@example.com"
		}
	}
}
```

### Update Post

**PUT** `/posts/:id` 🔒

Update an existing post (requires authentication and ownership).

**Request Body:**

```json
{
	"title": "string (min 3 chars)",
	"content": "string (min 10 chars)"
}
```

**Response (200):**

```json
{
	"message": "Post updated successfully",
	"post": {
		"id": 1,
		"title": "Updated Post Title",
		"content": "Updated content...",
		"authorId": 1,
		"createdAt": "2024-01-05T00:00:00.000Z",
		"updatedAt": "2024-01-08T12:00:00.000Z",
		"author": {
			"username": "john_doe",
			"email": "john@example.com"
		}
	}
}
```

### Delete Post

**DELETE** `/posts/:id` 🔒

Delete a post (requires authentication and ownership).

**Response (200):**

```json
{
	"message": "Post deleted successfully",
	"deletedPost": {
		"id": 1,
		"title": "Deleted Post Title"
	}
}
```

---

## 🛠️ Utility Endpoints

### Health Check

**GET** `/health`

Check API health and get basic statistics.

**Response (200):**

```json
{
	"status": "OK",
	"timestamp": "2024-01-08T12:00:00.000Z",
	"uptime": 3600,
	"users": 3,
	"posts": 3
}
```

### API Information

**GET** `/`

Get API documentation and test credentials.

### Reset Data

**POST** `/reset`

Reset all data to initial state (useful for testing).

**Response (200):**

```json
{
	"message": "Data reset successfully",
	"users": 3,
	"posts": 3
}
```

---

## 🧪 Test Credentials

The API comes with pre-loaded test data:

**Test Users:**

- **Username:** `john_doe` **Password:** `password123`
- **Username:** `jane_smith` **Password:** `password123`
- **Username:** `bob_wilson` **Password:** `password123`

## 📋 Error Responses

All endpoints return consistent error responses:

```json
{
	"error": "Error Type",
	"message": "Detailed error description"
}
```

**Common HTTP Status Codes:**

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error

## 🧪 Testing Examples

### Using cURL

```bash
# 1. Login and get token
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","password":"password123"}' \
  | grep -o '"token":"[^"]*' | grep -o '[^"]*$')

# 2. Create a new post
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"My Test Post","content":"This is a test post content."}'

# 3. Get all posts
curl http://localhost:3000/posts

# 4. Get posts with pagination
curl "http://localhost:3000/posts?page=1&limit=2"
```

### Using JavaScript/Fetch

```javascript
// Login
const loginResponse = await fetch('http://localhost:3000/auth/login', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({
		username: 'john_doe',
		password: 'password123',
	}),
});
const { token } = await loginResponse.json();

// Create post
const postResponse = await fetch('http://localhost:3000/posts', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	},
	body: JSON.stringify({
		title: 'My New Post',
		content: 'This is the content of my new post.',
	}),
});
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

### Available Scripts

```bash
# Development with auto-reload
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Alternative: using npm
npm run dev
npm run build
npm start
```

## 🎓 Learning Scenarios

This API is perfect for practicing:

1. **API Testing Tools**: Postman, Insomnia, Thunder Client
2. **Automated Testing**: Jest, Mocha, Supertest
3. **Load Testing**: Artillery, Apache Bench
4. **Frontend Integration**: React, Vue, Angular
5. **Authentication Flows**: JWT token handling
6. **Error Handling**: Testing various error scenarios
7. **HTTP Methods**: GET, POST, PUT, DELETE operations

## 🤝 Contributing

This is an educational project. Feel free to:

- Add new endpoints
- Improve error handling
- Add more test data
- Enhance documentation
- Add automated tests

## 📄 License

This project is available for educational use. Feel free to modify and distribute for learning purposes.

---

🔗 **Legend**: 🔒 = Requires Authentication

---

_QuickPost API - Making API learning quick and easy!_

# AntiGravity Model Management System API Documentation

Base URL: `http://localhost:5000/api/v1`

---

## 1. Authentication Endpoints (`/auth`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/auth/register` | Register a new user account | Public |
| POST | `/auth/login` | Authenticate user and return JWT tokens | Public |
| POST | `/auth/refresh-token` | Refresh expired access token | Public |
| POST | `/auth/logout` | Revoke active session | Authenticated |
| POST | `/auth/forgot-password` | Send password reset token email | Public |
| POST | `/auth/reset-password` | Reset password using valid token | Public |
| GET | `/auth/verify-email/:token` | Verify email address | Public |
| GET | `/auth/me` | Fetch authenticated user profile | Authenticated |

### Example: POST `/auth/login`
**Request Body:**
```json
{
  "email": "admin@antigravity.ai",
  "password": "Password123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "usr-admin-00000000-0000-000000000001",
      "email": "admin@antigravity.ai",
      "firstName": "System",
      "lastName": "Admin",
      "role": "ADMIN"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1Ni...",
      "refreshToken": "d8f7e2a0..."
    }
  }
}
```

---

## 2. AntiGravity Models Endpoints (`/models`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/models` | List models with search, filter & pagination | Public / Auth |
| GET | `/models/:id` | Get model detailed metadata | Public / Auth |
| POST | `/models` | Create a new AI model | Admin / Manager |
| PUT | `/models/:id` | Update model specification | Admin / Manager |
| DELETE | `/models/:id` | Soft delete/Archive model | Admin |
| POST | `/models/:id/images` | Upload image assets for model | Admin / Manager |

### Query Parameters for `GET /models`
- `page` (default: 1)
- `limit` (default: 10)
- `search` (Search by title, description, or framework)
- `category` (Category slug or ID)
- `status` (ACTIVE, DRAFT, ARCHIVED, DEPRECATED)
- `sortBy` (created_at, accuracy_score, downloads_count)
- `sortOrder` (asc, desc)

---

## 3. User Management Endpoints (`/users`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/users` | List all registered users | Admin |
| GET | `/users/:id` | Get user details | Admin |
| PUT | `/users/:id` | Update user status / role | Admin |
| DELETE | `/users/:id` | Deactivate user account | Admin |

---

## 4. Category & Analytics Endpoints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/categories` | List all model categories | Public |
| GET | `/analytics/overview` | Fetch system health and model metrics | Admin / Manager |

---

## 5. Standard API Response Schema

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Validation failed / Unauthorized",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address format"
    }
  ]
}
```

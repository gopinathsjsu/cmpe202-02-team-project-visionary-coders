# Backend API Contract

This document specifies the API endpoints that need to be implemented in the backend for the frontend to work correctly.

## Base URL

```
http://localhost:3001/api
```

Set this in frontend `.env.local` as `NEXT_PUBLIC_API_URL`

## Authentication Endpoints

### 1. Sign Up - Register New User

**Endpoint:** `POST /api/auth/signup`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "student@sjsu.edu",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "role": "user"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "student@sjsu.edu",
    "name": "John Doe",
    "role": "user",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**

400 Bad Request - Email already exists:
```json
{
  "success": false,
  "message": "Email already registered"
}
```

400 Bad Request - Validation error:
```json
{
  "success": false,
  "message": "Passwords do not match"
}
```

400 Bad Request - Invalid email domain:
```json
{
  "success": false,
  "message": "Email must be from a valid college domain"
}
```

---

### 2. Sign In - Authenticate User

**Endpoint:** `POST /api/auth/signin`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "student@sjsu.edu",
  "password": "SecurePass123!"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "student@sjsu.edu",
    "name": "John Doe",
    "role": "user",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**

401 Unauthorized - Invalid credentials:
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

404 Not Found - User doesn't exist:
```json
{
  "success": false,
  "message": "User not found"
}
```

---

### 3. Get Current User - Verify Session

**Endpoint:** `GET /api/auth/me`

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Success Response (200 OK):**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "student@sjsu.edu",
    "name": "John Doe",
    "role": "user",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**

401 Unauthorized - Invalid token:
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

401 Unauthorized - No token provided:
```json
{
  "success": false,
  "message": "No authentication token provided"
}
```

---

### 4. Verify Token - Check Token Validity

**Endpoint:** `POST /api/auth/verify`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200 OK):**
```json
{
  "valid": true
}
```

**Invalid Token Response (200 OK):**
```json
{
  "valid": false
}
```

---

## Data Models

### User Model

```typescript
interface User {
  id: string;                    // Unique identifier
  email: string;                 // College email (validated)
  name: string;                  // Full name
  role: 'user' | 'admin';       // User role
  password: string;              // Hashed password (never return in API)
  createdAt: Date;              // Account creation date
  updatedAt?: Date;             // Last update date
}
```

### JWT Token Payload

```typescript
interface JWTPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
  iat: number;                   // Issued at
  exp: number;                   // Expiration time
}
```

---

## Implementation Requirements

### 1. Password Hashing

**Required:** Hash passwords using bcrypt with a cost factor of 10 or higher.

```javascript
// Example using bcryptjs
const bcrypt = require('bcryptjs');
const hashedPassword = await bcrypt.hash(password, 10);
```

### 2. JWT Token Generation

**Required:** Generate JWT tokens with 7-day expiration.

```javascript
// Example using jsonwebtoken
const jwt = require('jsonwebtoken');
const token = jwt.sign(
  { userId: user.id, email: user.email, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);
```

### 3. Email Validation

**Required:** Validate that email ends with approved college domains.

Approved domains:
- sjsu.edu
- stanford.edu
- berkeley.edu
- ucla.edu
- usc.edu

### 4. Password Requirements

Validate that passwords meet these requirements:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### 5. CORS Configuration

**Required:** Enable CORS for frontend origin.

```javascript
// Example CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',  // Frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 6. Token Verification Middleware

Create middleware to verify JWT tokens:

```javascript
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'No authentication token provided' 
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};
```

---

## Database Schema

### Users Collection/Table

```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_role ON users(role);
```

---

## Environment Variables

Backend should use these environment variables:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=mongodb://localhost:27017/college-portal
# or
DATABASE_URL=postgresql://user:password@localhost:5432/college_portal

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:3000

# Optional: Email Service (for future features)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-email-password
```

---

## Error Handling

All endpoints should follow this error response format:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

**HTTP Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request (validation errors)
- 401: Unauthorized (authentication errors)
- 403: Forbidden (authorization errors)
- 404: Not Found
- 409: Conflict (duplicate email)
- 500: Internal Server Error

---

## Testing Endpoints

### Using curl

**Sign Up:**
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@sjsu.edu",
    "password": "TestPass123!",
    "confirmPassword": "TestPass123!",
    "role": "user"
  }'
```

**Sign In:**
```bash
curl -X POST http://localhost:3001/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@sjsu.edu",
    "password": "TestPass123!"
  }'
```

**Get Current User:**
```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Security Best Practices

1. **Never return passwords** in API responses
2. **Always hash passwords** before storing
3. **Use secure JWT secrets** (256-bit random string)
4. **Implement rate limiting** on auth endpoints
5. **Use HTTPS** in production
6. **Set secure cookie flags** (HttpOnly, Secure, SameSite)
7. **Validate all inputs** server-side
8. **Log authentication attempts** for security monitoring
9. **Implement account lockout** after failed attempts
10. **Use environment variables** for sensitive data

---

## Additional Recommended Endpoints

While not required immediately, consider implementing:

### Password Reset
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Email Verification
- `POST /api/auth/verify-email` - Verify email with token
- `POST /api/auth/resend-verification` - Resend verification email

### User Management (Admin Only)
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

---

## Notes

1. All timestamps should be in ISO 8601 format
2. Token expiration is set to 7 days but can be adjusted
3. Email validation is case-insensitive
4. Role can only be 'user' or 'admin'
5. The frontend expects exact response structures as specified
6. CORS must be properly configured for the frontend to work

---

## Implementation Checklist

- [ ] Set up database (MongoDB/PostgreSQL)
- [ ] Create User model/schema
- [ ] Implement password hashing with bcrypt
- [ ] Implement JWT token generation
- [ ] Create POST /api/auth/signup endpoint
- [ ] Create POST /api/auth/signin endpoint
- [ ] Create GET /api/auth/me endpoint
- [ ] Create POST /api/auth/verify endpoint
- [ ] Implement token verification middleware
- [ ] Configure CORS
- [ ] Add email domain validation
- [ ] Add password strength validation
- [ ] Test all endpoints
- [ ] Add error handling
- [ ] Set up environment variables
- [ ] Deploy backend

---

This contract ensures compatibility between the frontend and backend applications.

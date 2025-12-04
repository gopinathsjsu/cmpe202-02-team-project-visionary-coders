# Setup Guide - College Portal Frontend

This guide will help you set up and run the College Portal frontend application with authentication features.

## Quick Start

### 1. Prerequisites Check

Before starting, ensure you have:
- Node.js 18.x or higher installed
- npm (comes with Node.js)
- A code editor (VS Code recommended)
- Backend API running (or mock backend ready)

### 2. Installation Steps

```bash
# Navigate to the project directory
cd modified-frontend

# Install all dependencies
npm install

# Copy environment configuration
cp .env.example .env.local

# Edit .env.local and set your API URL
# NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Start the development server
npm run dev
```

### 3. Access the Application

Open your browser and go to: `http://localhost:3000`

## Detailed Setup Instructions

### Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Add any other environment variables as needed
```

**Important**: Never commit `.env.local` to version control!

### Understanding the File Structure

```
modified-frontend/
├── src/
│   ├── app/                      # Next.js 13+ App Router
│   │   ├── auth/
│   │   │   ├── signin/page.tsx  # Sign in page
│   │   │   └── signup/page.tsx  # Sign up page
│   │   ├── dashboard/page.tsx   # User dashboard
│   │   ├── admin/
│   │   │   └── dashboard/page.tsx # Admin dashboard
│   │   ├── layout.tsx           # Root layout with auth
│   │   └── page.tsx             # Landing page
│   ├── components/              # Reusable components
│   │   ├── Header.tsx          # Navigation header
│   │   ├── ProtectedRoute.tsx  # Route protection
│   │   ├── SignInForm.tsx      # Sign in form
│   │   └── SignUpForm.tsx      # Sign up form
│   ├── contexts/               # React Context
│   │   └── AuthContext.tsx    # Authentication state
│   ├── lib/                    # Utilities
│   │   ├── api.ts             # API client
│   │   └── validation.ts      # Form validation
│   └── types/                  # TypeScript types
│       └── auth.ts            # Auth types
└── public/                     # Static files
```

## Features Overview

### 1. Authentication System

#### Sign Up
- Location: `/auth/signup`
- Fields: Name, Email (college only), Password, Confirm Password, Role
- Validation: Real-time form validation with error messages
- Email restriction: Only college domains accepted

#### Sign In
- Location: `/auth/signin`
- Fields: Email, Password
- Automatic role-based redirect
- Session persistence with JWT

### 2. Role-Based Access

#### User Role
- Access to `/dashboard`
- View personal information
- Access courses and resources
- Cannot access admin features

#### Admin Role
- Access to `/admin/dashboard`
- All user permissions
- User management
- System statistics
- Configuration access

### 3. Email Validation

The system validates emails against approved college domains:

```typescript
// Located in: src/lib/validation.ts
const VALID_COLLEGE_DOMAINS = [
  'sjsu.edu',
  'stanford.edu',
  'berkeley.edu',
  'ucla.edu',
  'usc.edu',
];
```

**To add more domains:**
1. Open `src/lib/validation.ts`
2. Add your college domain to the array
3. Save and restart the development server

### 4. Password Requirements

Passwords must include:
- At least 8 characters
- One uppercase letter (A-Z)
- One lowercase letter (a-z)
- One number (0-9)
- One special character (!@#$%^&*)

## Testing the Application

### Test User Sign Up

1. Go to `http://localhost:3000/auth/signup`
2. Enter test data:
   - Name: `Test User`
   - Email: `test@sjsu.edu`
   - Password: `TestPass123!`
   - Confirm Password: `TestPass123!`
   - Role: `User`
3. Click "Sign up"
4. You should be redirected to `/dashboard`

### Test Admin Sign Up

1. Go to `http://localhost:3000/auth/signup`
2. Enter admin data:
   - Name: `Admin User`
   - Email: `admin@sjsu.edu`
   - Password: `AdminPass123!`
   - Confirm Password: `AdminPass123!`
   - Role: `Admin`
3. Click "Sign up"
4. You should be redirected to `/admin/dashboard`

### Testing Sign In

1. Go to `http://localhost:3000/auth/signin`
2. Enter credentials from sign up
3. Click "Sign in"
4. Verify redirect to appropriate dashboard

### Testing Protected Routes

1. Try accessing `/dashboard` without signing in
   - Should redirect to `/auth/signin`
2. Sign in as user and try accessing `/admin/dashboard`
   - Should redirect to `/dashboard`
3. Sign in as admin and access `/admin/dashboard`
   - Should show admin dashboard

## Backend API Requirements

The frontend expects these API endpoints:

### POST /api/auth/signup
Register a new user

**Request:**
```json
{
  "name": "John Doe",
  "email": "student@sjsu.edu",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "role": "user"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "token": "jwt-token-string",
  "user": {
    "id": "user-id",
    "email": "student@sjsu.edu",
    "name": "John Doe",
    "role": "user",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### POST /api/auth/signin
Authenticate user

**Request:**
```json
{
  "email": "student@sjsu.edu",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt-token-string",
  "user": {
    "id": "user-id",
    "email": "student@sjsu.edu",
    "name": "John Doe",
    "role": "user",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### GET /api/auth/me
Get current user (requires Authorization header)

**Headers:**
```
Authorization: Bearer jwt-token-string
```

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "email": "student@sjsu.edu",
    "name": "John Doe",
    "role": "user",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### POST /api/auth/verify
Verify JWT token validity

**Request:**
```json
{
  "token": "jwt-token-string"
}
```

**Response:**
```json
{
  "valid": true
}
```

## Common Issues and Solutions

### Issue: "Email must be from a valid college domain"

**Solution:**
- Check that your email ends with an approved domain
- Verify the domain is in `VALID_COLLEGE_DOMAINS` array
- Add your college domain if it's missing

### Issue: "Failed to connect to API"

**Solution:**
- Verify backend is running
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure CORS is enabled on backend
- Check browser console for error details

### Issue: "Cannot access admin dashboard"

**Solution:**
- Verify your account has `role: 'admin'`
- Sign out and sign in again
- Check JWT token contains correct role

### Issue: Redirects to sign in page immediately

**Solution:**
- Token may have expired
- Check cookie storage in browser
- Sign in again to get new token
- Verify token expiration settings

### Issue: "Password does not meet requirements"

**Solution:**
- Ensure password has:
  - At least 8 characters
  - One uppercase letter
  - One lowercase letter
  - One number
  - One special character
- Example valid password: `SecurePass123!`

## Development Tips

### Hot Reload
The application supports hot reload. Changes to files will automatically refresh the browser.

### TypeScript
All files use TypeScript. Check for type errors:
```bash
npx tsc --noEmit
```

### Linting
Run ESLint to check code quality:
```bash
npm run lint
```

### Building for Production
```bash
npm run build
npm start
```

## Customization Guide

### Changing Theme Colors

Edit Tailwind configuration or use inline classes:
- Primary color: `indigo-600`
- Success color: `green-600`
- Warning color: `yellow-600`
- Danger color: `red-600`

### Adding New Pages

1. Create new file in `src/app/your-page/page.tsx`
2. Wrap in `ProtectedRoute` if needed
3. Add navigation link in `Header.tsx`

### Modifying Forms

Forms use React Hook Form with Zod validation:
1. Update schema in `src/lib/validation.ts`
2. Modify form component
3. Update TypeScript types

### Adding More User Fields

1. Update types in `src/types/auth.ts`
2. Modify validation in `src/lib/validation.ts`
3. Update forms in components
4. Update API client in `src/lib/api.ts`
5. Ensure backend accepts new fields

## Security Best Practices

### Do's
✅ Use HTTPS in production
✅ Validate inputs on both client and server
✅ Use HTTP-only cookies for tokens
✅ Implement rate limiting
✅ Keep dependencies updated
✅ Use strong password requirements
✅ Validate email domains

### Don'ts
❌ Don't commit `.env.local` files
❌ Don't store passwords in plain text
❌ Don't expose JWT secrets
❌ Don't skip input validation
❌ Don't allow weak passwords
❌ Don't trust client-side validation alone

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Custom Server Deployment

1. Build the project: `npm run build`
2. Copy files to server
3. Set environment variables
4. Start: `npm start`
5. Use PM2 or similar for process management

## Support and Resources

### Documentation
- Next.js: https://nextjs.org/docs
- React: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- Zod: https://zod.dev

### Getting Help
1. Check this guide
2. Review README.md
3. Check browser console
4. Verify backend connectivity
5. Contact development team

## Next Steps

After setup:
1. Test all authentication flows
2. Customize college domains
3. Style to match your brand
4. Add additional features
5. Set up production environment
6. Implement monitoring
7. Configure backups

## Version History

- v1.0.0 - Initial release with authentication system
  - User and admin sign up/sign in
  - College email validation
  - Role-based dashboards
  - Protected routes
  - JWT authentication

# AI-Genius Auth System

A complete full-stack assignment project for **JWT Authentication, Refresh Tokens, and Role-Based Access Control (RBAC)** using Node.js/Express and React.

## What is included?

- Node.js + Express backend
- Mock user database
- Bcrypt hashed passwords
- JWT access token
- Refresh token in httpOnly cookie
- Refresh token whitelist
- RBAC middleware
- Three protected mock AI endpoints
- Professional React frontend
- Postman collection
- `.env.example` files

## Test Users

| Role | Email | Password |
|---|---|---|
| Admin | admin@aigenius.com | admin123 |
| Premium_User | premium@aigenius.com | premium123 |
| Free_User | free@aigenius.com | free123 |

## Backend Setup

Open terminal in VS Code:

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend will run on:

```txt
http://localhost:5000
```

## Frontend Setup

Open another terminal in VS Code:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

```txt
http://localhost:5173
```

## Important Testing Flow

1. Login using one of the test users.
2. Copy/use the returned access token automatically in the frontend.
3. Test Free Model.
4. Test Premium Model with Free_User to see 403 Forbidden.
5. Test Premium Model with Premium_User or Admin.
6. Test Purge Cache with Admin only.
7. Use Refresh Token button to get a new access token.

## API Endpoints

### Auth

```txt
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me
```

### AI Models

```txt
GET    /api/ai/free-model
POST   /api/ai/premium-model
DELETE /api/ai/purge-cache
```

## Token Expiry Testing

By default:

```env
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d
```

For demo/testing, you can change access token expiry in `backend/.env`:

```env
ACCESS_TOKEN_EXPIRES=20s
```

Then restart backend:

```bash
npm run dev
```

After 20 seconds, protected API calls will return expired token error. Then call refresh token endpoint from frontend or Postman.


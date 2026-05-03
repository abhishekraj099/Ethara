# Team Task Manager Backend

This is the Express and MongoDB API for the Team Task Manager application.

## Project Links

- GitHub repository: https://github.com/abhishekraj099/Ethara
- Backend deployment: https://ethara-production-6802.up.railway.app/
- Frontend deployment: https://ethara-six.vercel.app

## Overview

The backend provides:

- User authentication with JWT
- Project APIs
- Task APIs
- Role-aware application data access
- Health and root routes for deployment checks

## Tech Stack

- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- bcryptjs for password hashing

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the backend directory:

```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Admin Credentials (Secure admin-only login)
ADMIN_ID=NBXADMIN01
ADMIN_PASSWORD=admin@123
```

**Important**: Change the `ADMIN_ID` and `ADMIN_PASSWORD` to your own secure values before deployment.

3. Start the server:

```bash
npm run dev
```

## Available Scripts

- `npm start` - run the server with Node.js
- `npm run dev` - run the server with Nodemon

## Routes

- `GET /` - root route for deployment checks
- `GET /health` - health check route
- `POST /api/auth/signup` - register a user account
- `POST /api/auth/login` - log in a user with email/password
- `POST /api/auth/admin-login` - log in as admin with credentials
- `GET /api/auth/me` - get current user
- `GET /api/projects` - project endpoints
- `GET /api/tasks` - task endpoints

## Admin Login

The `/api/auth/admin-login` endpoint provides secure admin access:

**Request:**
```json
{
  "adminId": "NBXADMIN01",
  "password": "admin@123"
}
```

**Response:**
```json
{
  "_id": "user_id",
  "name": "System Admin",
  "email": "admin@system.local",
  "role": "admin",
  "token": "jwt_token",
  "adminId": "NBXADMIN01"
}
```

Only users with the correct Admin ID and password can access the admin portal.

## Deployment Notes

This backend is Railway-friendly because it uses `process.env.PORT` and exposes a root route. In production, set the following environment variables on Railway:

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `NODE_ENV=production`
- `FRONTEND_URL`
- `ADMIN_ID` - Your secure admin ID (e.g., NBXADMIN01)
- `ADMIN_PASSWORD` - Your secure admin password

**Security Recommendation**: Use strong, unique values for `ADMIN_ID` and `ADMIN_PASSWORD` in production.

Production services:

- API: https://ethara-production-6802.up.railway.app/
- Web app: https://ethara-six.vercel.app

## Project Structure

- `server.js` - Express app entry point
- `routes` - API route handlers
- `models` - MongoDB models
- `middleware` - authentication and request middleware
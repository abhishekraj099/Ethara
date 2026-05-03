# Team Task Manager Backend

This is the Express and MongoDB API for the Team Task Manager application.

## Project Links

- GitHub repository: https://github.com/abhishekraj099/Ethara
- Backend deployment: https://ethara-production-6802.up.railway.app
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
```

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
- `POST /api/auth/signup` - register a user
- `POST /api/auth/login` - log in a user
- `GET /api/auth/me` - get current user
- `GET /api/projects` - project endpoints
- `GET /api/tasks` - task endpoints

## Deployment Notes

This backend is Railway-friendly because it uses `process.env.PORT` and exposes a root route. In production, set the following environment variables on Railway:

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `NODE_ENV=production`
- `FRONTEND_URL`

Production services:

- API: https://ethara-production-6802.up.railway.app
- Web app: https://ethara-six.vercel.app

## Project Structure

- `server.js` - Express app entry point
- `routes` - API route handlers
- `models` - MongoDB models
- `middleware` - authentication and request middleware
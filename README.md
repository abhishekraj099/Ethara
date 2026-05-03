# Team Task Manager

Team Task Manager is a full-stack project for managing users, projects, and tasks with authentication and role-based access.

## What This Project Does

This application provides a complete task and project management workflow:

- User signup and login with JWT authentication
- Role-aware access for admin and member users
- Project creation, updates, member management, and details
- Task creation, status tracking, assignment, and filtering
- Separate frontend and backend deployment support

## Implemented Work

- Built an Express API with auth, project, and task routes
- Connected the backend to MongoDB through Mongoose
- Added password hashing and token-based authentication
- Created a React frontend with routing and shared layout
- Centralized API requests through a shared Axios client
- Added Railway-ready backend configuration with `process.env.PORT`
- Added Vercel-ready frontend configuration using `VITE_API_URL`
- Wrote documentation for backend, frontend, and combined setup

## Project Links

- GitHub repository: https://github.com/abhishekraj099/Ethara
- Backend deployment: https://ethara-production-6802.up.railway.app/
- Frontend deployment: https://ethara-six.vercel.app

## Repository Structure

- `backend` - Express and MongoDB API
- `frontend` - React and Vite client application

### Backend Structure

- `server.js` - Express entry point, middleware, routes, and database connection
- `routes/auth.js` - signup, login, current user, and user list endpoints
- `routes/projects.js` - project CRUD and membership endpoints
- `routes/tasks.js` - task CRUD, filtering, dashboard, and personal task endpoints
- `models/User.js` - user schema and password handling
- `models/Project.js` - project schema and members
- `models/Task.js` - task schema and assignment data
- `middleware/auth.js` - protected route authentication

### Frontend Structure

- `src/main.jsx` - application bootstrap
- `src/App.jsx` - routing and app shell
- `src/context/AuthContext.jsx` - auth state, login, signup, logout
- `src/api/index.js` - shared Axios client and API base handling
- `src/components/Layout.jsx` - common application layout
- `src/pages/Login.jsx` - login screen
- `src/pages/Signup.jsx` - signup screen
- `src/pages/Dashboard.jsx` - dashboard overview
- `src/pages/Projects.jsx` - project list and management
- `src/pages/ProjectDetail.jsx` - project detail view
- `src/pages/Tasks.jsx` - task list and filters

## Quick Start

1. Install dependencies in both apps:

```bash
cd backend
npm install

cd ../frontend
npm install
```

2. Configure environment variables.

Backend `.env`:

```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Frontend `.env`:

```bash
VITE_API_URL=http://localhost:5000
```

3. Run both apps:

```bash
# terminal 1
cd backend
npm run dev

# terminal 2
cd frontend
npm run dev
```

## Deployment Guide

### Backend on Railway

- Connect the GitHub repository to Railway
- Set `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, and `FRONTEND_URL`
- Railway will use `PORT` automatically
- Backend URL: https://ethara-production-6802.up.railway.app/

### Frontend on Vercel

- Set `VITE_API_URL` to the deployed Railway backend URL
- Add SPA rewrite support so React Router routes load correctly on refresh
- Frontend URL: https://ethara-six.vercel.app

## API Base URLs

- Local backend: `http://localhost:5000`
- Local API prefix: `http://localhost:5000/api`
- Production API prefix: `https://your-railway-app.up.railway.app/api`

## Files To Configure For Deployment

- `backend/.env` - backend secrets and database connection
- `frontend/.env` - frontend API base URL
- `backend/server.js` - server root route and port handling
- `frontend/src/api/index.js` - normalized API base URL
- `frontend/src/context/AuthContext.jsx` - auth login and signup calls

## Notes

- The backend includes a root route and health check route for deployment validation.
- The frontend uses a shared Axios client that normalizes the API base URL.
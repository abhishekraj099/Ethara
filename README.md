# Team Task Manager

Team Task Manager is a full-stack project for managing users, projects, and tasks with authentication and role-based access.

## Project Links

- GitHub repository: https://github.com/abhishekraj099/Ethara
- Backend deployment: https://ethara-production-6802.up.railway.app/
- Frontend deployment: https://ethara-six.vercel.app

## Repository Structure

- `backend` - Express and MongoDB API
- `frontend` - React and Vite client application

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

## Notes

- The backend includes a root route and health check route for deployment validation.
- The frontend uses a shared Axios client that normalizes the API base URL.
# Team Task Manager Frontend

This is the React user interface for the Team Task Manager application. It is built with Vite, React Router, Axios, and React Hot Toast.

## Project Links

- GitHub repository: https://github.com/abhishekraj099/Ethara
- Backend API: https://ethara-production-6802.up.railway.app
- Frontend deployment: https://ethara-six.vercel.app

## Overview

The frontend provides the following workflows:

- Authentication with login and signup screens
- Project management and project detail views
- Task listing and task management screens
- Shared layout and authenticated navigation

## Tech Stack

- React 19
- Vite
- React Router DOM
- Axios
- Lucide React
- React Hot Toast

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the frontend directory:

```bash
VITE_API_URL=https://your-backend-domain.com
```

For local development, you can use:

```bash
VITE_API_URL=http://localhost:5000
```

3. Start the development server:

```bash
npm run dev
```

## Available Scripts

- `npm run dev` - start the Vite development server
- `npm run build` - create a production build
- `npm run lint` - run ESLint
- `npm run preview` - preview the production build locally

## API Configuration

All API requests go through the shared Axios client in `src/api/index.js`. The base URL is normalized so both local and hosted environments work with the same code path.

## Deployment Notes

If you deploy this frontend to Vercel, configure the environment variable `VITE_API_URL` and add SPA rewrite support so React Router routes continue to work on refresh.

Recommended production values:

- `VITE_API_URL=https://ethara-production-6802.up.railway.app`
- Frontend URL: https://ethara-six.vercel.app

## Project Structure

- `src/api` - shared API client
- `src/context` - authentication state
- `src/components` - reusable UI components
- `src/pages` - application pages
- `src/assets` - static assets

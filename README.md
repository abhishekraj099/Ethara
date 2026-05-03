# Team Task Manager

Team Task Manager is a full-stack project for managing users, projects, and tasks with authentication and role-based access.

## What This Project Does

This application provides a complete task and project management workflow:

- **Dual Authentication System**: Separate User and Admin login portals
- **User Features**: View projects, apply to join, collaborate with teams
- **Admin Features**: Create projects, upload details, manage team requirements
- **Role-aware access** for admin and member users
- **Project creation, updates, member management, and details**
- **Task creation, status tracking, assignment, and filtering**
- **Separate frontend and backend deployment support**

## Authentication Flow

### Two Login Paths

1. **User Login** - Normal users can:
   - Create an account via signup
   - View all projects
   - Apply to join projects
   - Collaborate with team members
   - Manage assigned tasks

2. **Admin Login** - Secure admin-only access with:
   - Special Admin ID (e.g., NBXADMIN01)
   - Secret Admin Password
   - Full project creation and management
   - Complete access control over all projects
   - Team management and requirements setup

### Landing Page

When users visit the application, they see a welcome screen with two options:
- **User Portal** - For regular users to login/signup
- **Admin Portal** - For admins to login with credentials

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

## Role-Based Access Control

The application implements a two-tier role system: **Admin** and **Member**, with additional role management at the project level.

### System Roles

#### Admin (System Admin)
- **Created**: The first user to sign up automatically becomes a system admin
- **Permissions**:
  - Can create projects
  - Can manage all projects (edit, delete)
  - Can view all users
  - Can edit/delete any task
  - Can view projects created by any user
  - Can add/remove members from any project
  - Can promote members to project admin role

#### Member (Regular User)
- **Created**: All users after the first automatically become members
- **Permissions**:
  - Can create projects (becomes project owner)
  - Can only update task status on assigned tasks
  - Can view tasks assigned to them
  - Can only manage projects they own or are members of
  - Cannot create other system admins
  - Cannot delete projects unless they are the owner

### Project-Level Roles

Within each project, members can have two roles:

#### Project Admin
- Can edit project details
- Can add/remove project members
- Can create, edit, and delete tasks
- Can manage member roles
- Can delete the project

#### Project Member
- Can view project and tasks
- Can only update task status
- Cannot create tasks
- Cannot modify project settings
- Cannot manage other members

### Permission Rules

**Creating a Task**:
- Only project admins and project owners can create tasks

**Editing a Task**:
- Project admins can edit all fields
- Project owner can edit all fields
- System admins can edit all fields
- Task creator can edit all fields
- Regular members can only update task status

**Deleting a Task**:
- Project admins, project owner, system admin, or task creator

**Managing Projects**:
- System admins have full access
- Project owner is automatically a project admin

### Authentication Flow

1. First user signs up → becomes **Admin**
2. Subsequent users sign up → become **Member**
3. Admins can add members to projects with specific roles
4. Project role is independent of system role

### Frontend Role Indicators

The UI automatically hides/shows features based on role:
- Delete buttons only appear for authorized users
- "Add Task" button only shows for project admins
- "Add Member" button only shows for project admins
- Delete member buttons only show for project admins


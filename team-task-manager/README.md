# Team Task Manager

Team Task Manager is a full-stack project for managing users, projects, and tasks with authentication and role-based access.

## 📚 Complete Documentation

**For comprehensive authentication system documentation, see:** [**AUTHENTICATION.md**](AUTHENTICATION.md)

The AUTHENTICATION.md file covers:
- ✅ Complete authentication flow with UI/UX design
- ✅ Welcome page, Member portal (Login/Signup), and Admin portal
- ✅ Tab navigation system with styling details
- ✅ Motivational messaging and branding
- ✅ All API endpoints and request/response formats
- ✅ Security implementation details
- ✅ Environment variable configuration
- ✅ Testing checklist
- ✅ Troubleshooting guide

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

### 🎯 Mission Statement
> "Plan with clarity, assign with purpose, and track every step — because great teams don't just work together, they deliver together."

### Landing Page (Welcome)
Users start at a professional welcome page with a dark theme, neon green accents, and glassmorphism effects. They choose between:
- **Member Portal** - For regular users to login/signup
- **Admin Portal** - For administrators to login with credentials

### Two Portal System

#### 1. Member Portal - `/user-login` and `/user-signup`
**Features:**
- 🔄 **Dual-Tab Interface**: Users can switch between Login and Signup tabs
- 📝 **Login Tab**: Email and password for existing members
- ✍️ **Signup Tab**: Name, email, and password for new members
- 🎨 **Visual Tab Indicator**: Active tab highlighted with green gradient
- 📱 **Responsive**: Mobile-friendly design

**Login Experience:**
- Enter email and password
- Click "Sign In" button
- Auto-redirect to dashboard
- Toast notification: "Welcome back!"

**Signup Experience:**
- Enter name, email, and password
- Click "Create Account" button
- **First user becomes admin**, subsequent users are members
- Auto-login and redirect to dashboard
- Toast notification: "Account created! You are logged in."

#### 2. Admin Portal - `/admin-login`
**Features:**
- 🔐 **Secure Admin-Only Access**: No signup option available
- ⚠️ **Special Credentials**: Admin ID + Admin Password from environment variables
- 📋 **Demo Credentials Box**: Shows demo credentials for testing
- 🚫 **No Tabs**: Login-only interface, maximum security

**Admin Login:**
- Enter Admin ID (e.g., NBXADMIN01)
- Enter Admin Password
- Demo credentials displayed below form
- Click "Admin Sign In" button
- Auto-redirect to dashboard with admin privileges
- Toast notification: "Admin login successful!"

### User Roles

1. **User Login** - Normal users can:
   - Create an account via signup with tab interface
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

### 🎨 Design System
- **Dark Theme**: Professional dark background (#030308)
- **Neon Green**: Primary actions (#00DC6E)
- **Cyan Accents**: Secondary highlights (#2DD4BF)
- **Glassmorphism**: Semi-transparent cards with 20px blur
- **Smooth Animations**: All interactions smoothly animated
- **Green Glow**: Buttons and active elements have glow effects

## Implemented Work

### Core Features
- Built an Express API with auth, project, and task routes
- Connected the backend to MongoDB through Mongoose
- Added password hashing and token-based authentication
- Created a React frontend with routing and shared layout
- Centralized API requests through a shared Axios client
- Added Railway-ready backend configuration with `process.env.PORT`
- Added Vercel-ready frontend configuration using `VITE_API_URL`
- Wrote documentation for backend, frontend, and combined setup

### Authentication System (Recent)
- ✅ Implemented dual-portal authentication system (User and Admin)
- ✅ Created beautiful Welcome landing page with role selection
- ✅ Secure admin login with environment variable credentials (ADMIN_ID, ADMIN_PASSWORD)
- ✅ User login/signup with tab navigation interface
- ✅ Tab styling with active/inactive states
- ✅ Professional dark theme with neon green accents and glassmorphism
- ✅ Motivational messaging across all authentication pages
- ✅ Admin-only portal with no signup option (security feature)
- ✅ First-user-becomes-admin system for initial setup
- ✅ Fixed Vercel 404 errors with SPA rewrite configuration
- ✅ Comprehensive authentication documentation (AUTHENTICATION.md)

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
- `src/pages/Welcome.jsx` - welcome/landing page with portal selection
- `src/pages/UserLogin.jsx` - member login page with tab navigation
- `src/pages/UserSignup.jsx` - member signup page with tab navigation
- `src/pages/AdminLogin.jsx` - secure admin login page (no signup)
- `src/pages/AuthPages.css` - centralized auth pages styling
- `src/pages/Welcome.css` - welcome page styling
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
ADMIN_ID=NBXADMIN01
ADMIN_PASSWORD=admin@123
```

Frontend `.env`:

```bash
VITE_API_URL=http://localhost:5000
```

**Demo Credentials for Testing:**
- **Admin ID**: NBXADMIN01
- **Admin Password**: admin@123
- **Member**: Create via signup form at `/user-signup`

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
- Set the following environment variables:
  ```
  PORT=5000
  MONGO_URI=<your-mongodb-uri>
  JWT_SECRET=<strong-secret-key>
  NODE_ENV=production
  FRONTEND_URL=<your-vercel-url>
  ADMIN_ID=NBXADMIN01
  ADMIN_PASSWORD=admin@123
  ```
- Railway will use `PORT` automatically
- Backend URL: https://ethara-production-6802.up.railway.app/

### Frontend on Vercel

- Set environment variables:
  ```
  VITE_API_URL=https://ethara-production-6802.up.railway.app
  ```
- Add SPA rewrite support (vercel.json) so React Router routes load correctly on refresh
- Frontend URL: https://ethara-six.vercel.app

### Admin Credentials for Production

⚠️ **IMPORTANT**: Change the default admin credentials in production!

1. Update `ADMIN_ID` and `ADMIN_PASSWORD` in Railway environment variables
2. Demo credentials shown (NBXADMIN01 / admin@123) are for development only
3. Use strong, unique credentials for production
4. Never commit credentials to the repository

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


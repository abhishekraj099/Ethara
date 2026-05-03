# Authentication System Documentation

## Overview

The Team Task Manager features a comprehensive dual-portal authentication system designed to manage both regular team members and system administrators separately. This document details the complete authentication flow, UI/UX design, and implementation.

---

## 🎯 Authentication Philosophy

**Mission Statement:**
> "Plan with clarity, assign with purpose, and track every step — because great teams don't just work together, they deliver together."

The authentication system is built around two distinct user roles with separate access paths:

1. **Team Members** - Collaborate with purpose, stay aligned, track progress, and drive results together
2. **System Admin** - Lead with clarity, organize teams, delegate tasks, and oversee delivery with confidence

---

## 🏠 Welcome Page (Landing)

### Visual Design
- **Dark Theme**: Professional dark background with neon green (#00DC6E) and cyan (#2DD4BF) accents
- **Glassmorphism**: Semi-transparent cards with backdrop blur effects
- **Responsive**: Mobile-friendly design
- **Motivational**: Displays powerful company mission statement

### Hero Content
```
Headline: "Team Task Manager"
Tagline: "Plan with clarity, assign with purpose, and track every step — 
because great teams don't just work together, they deliver together."
```

### Portal Selection
Two main cards present the user with clear choices:

#### 1. Member Login Card
- **Icon**: User profile icon
- **Title**: "Member Login"
- **Description**: "Collaborate with purpose—stay aligned, track progress, and drive results together"
- **Action Button**: "Sign In / Sign Up"
- **Route**: `/user-login`
- **Features Available**:
  - View all projects
  - Apply to join projects
  - Track assigned tasks
  - Collaborate with team members

#### 2. Admin Login Card
- **Icon**: Lock/Security icon
- **Title**: "Admin Login"
- **Description**: "Lead with clarity—organize teams, delegate tasks, and oversee delivery with confidence"
- **Action Button**: "Admin Portal"
- **Route**: `/admin-login`
- **Features Available**:
  - Create new projects
  - Manage all teams
  - Assign tasks
  - Full system administration

---

## 👥 Member Portal (User Login/Signup)

### Dual-Tab Interface

#### Tab Navigation (Visual Indicator)
```
┌─────────────────────────────────┐
│ Login Tab (Active) │ Signup Tab  │
└─────────────────────────────────┘
```

**Tab Styling:**
- **Active Tab**: Green gradient (#00DC6E) with glow effect
- **Inactive Tab**: Dark background with hover state
- **Smooth Transitions**: All interactions animated
- **Visual Feedback**: Clear active state indicator

### Login Page (`/user-login`)

**Tab State**: Login Tab Active

**Form Fields:**
- **Email**: Standard email input
  - Placeholder: "you@example.com"
  - Validation: Required, valid email format
  
- **Password**: Secure password input
  - Placeholder: "Enter password"
  - Validation: Required, minimum 6 characters

**Submission:**
- Button Label: "Sign In"
- On Success: Redirect to `/dashboard`
- On Error: Display error banner in rose color (#FB7185)
- Toast Notification: "Welcome back!"

**Navigation Options:**
- **Don't have account?** → Link to `/user-signup`
- **Admin Access?** → Link to `/admin-login`

**Backend Endpoint:**
```
POST /auth/login
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "password123"
}

Response (Success):
{
  "_id": "user_id",
  "name": "User Name",
  "email": "user@example.com",
  "role": "member",
  "token": "jwt_token_here"
}
```

### Signup Page (`/user-signup`)

**Tab State**: Signup Tab Active

**Form Fields:**
- **Name**: Full name input
  - Placeholder: "Your full name"
  - Validation: Required, minimum 2 characters
  - Length: At least 2 characters

- **Email**: Standard email input
  - Placeholder: "you@example.com"
  - Validation: Required, valid email format, must be unique
  - Error: "Email already registered" if exists

- **Password**: Secure password input
  - Placeholder: "Create a password"
  - Validation: Required, minimum 6 characters

**Submission:**
- Button Label: "Create Account"
- On Success: Redirect to `/dashboard`
- Auto-Login: User is automatically logged in after signup
- On Error: Display validation error messages
- Toast Notification: "Account created! You are logged in."

**Special Logic:**
- **First Signup**: First user registered gets "admin" role
- **Subsequent Signups**: All users get "member" role

**Navigation Options:**
- **Already have account?** → Link to `/user-login`
- **Admin Access?** → Link to `/admin-login`

**Backend Endpoint:**
```
POST /auth/signup
Content-Type: application/json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123"
}

Response (Success):
{
  "_id": "user_id",
  "name": "User Name",
  "email": "user@example.com",
  "role": "admin|member",  // admin if first user, member otherwise
  "token": "jwt_token_here"
}
```

---

## 🔐 Admin Portal (Admin Login Only)

### Secure Single-Form Interface

**Tab Navigation**: NONE
- No tabs visible
- No signup option available
- Login-only access
- Maximum security

### Login Page (`/admin-login`)

**Exclusive Features:**
- No signup/registration allowed
- Credentials-based authentication only
- Demo credentials displayed for testing

**Form Fields:**
- **Admin ID**: Special administrator identifier
  - Placeholder: "e.g., NBXADMIN01"
  - Example: "NBXADMIN01"
  - Validation: Required, must match `process.env.ADMIN_ID`
  - Case-Sensitive: Yes

- **Password**: Admin password
  - Placeholder: "Enter admin password"
  - Example: "admin@123"
  - Validation: Required, must match `process.env.ADMIN_PASSWORD`
  - Case-Sensitive: Yes

**Submission:**
- Button Label: "Admin Sign In"
- On Success: Redirect to `/dashboard` (with admin role access)
- On Error: Display error banner with message
- Toast Notification: "Admin login successful!"

**Demo Credentials Box:**
```
┌────────────────────────────────┐
│ Demo Credentials (Green Box)    │
├────────────────────────────────┤
│ Admin ID: NBXADMIN01            │
│ Password: admin@123             │
└────────────────────────────────┘
```

**Security Features:**
- ✅ Credentials stored in environment variables
- ✅ No hardcoded credentials in code
- ✅ No signup option available
- ✅ Special authentication endpoint
- ✅ Separate role verification

**Navigation Options:**
- **Not an admin?** → Link to `/user-login`
- No signup link provided

**Backend Endpoint:**
```
POST /auth/admin-login
Content-Type: application/json
{
  "adminId": "NBXADMIN01",
  "password": "admin@123"
}

Response (Success):
{
  "_id": "admin_user_id",
  "name": "System Admin",
  "email": "admin@system.local",
  "role": "admin",
  "adminId": "NBXADMIN01",
  "token": "jwt_token_here"
}

Response (Error):
{
  "message": "Invalid admin credentials"
}
```

---

## 🎨 Design System & Styling

### Color Palette

| Element | Color | Hex Code | Usage |
|---------|-------|----------|-------|
| Primary Action | Neon Green | #00DC6E | Buttons, active tabs, borders |
| Secondary Action | Cyan/Teal | #2DD4BF | Accents, highlights |
| Background | Dark Navy | #030308 | Page background |
| Card Background | Dark Navy (60% transparent) | rgba(11, 11, 20, 0.6) | Card backgrounds |
| Text Primary | Off-White | #FAFAFA | Main text |
| Text Secondary | Light Gray | rgba(255, 255, 255, 0.55) | Secondary text |
| Error | Rose | #FB7185 | Error messages |
| Border | Green (9% opacity) | rgba(0, 255, 130, 0.09) | Card borders |

### Visual Effects

**Glassmorphism:**
- Backdrop blur: 20px
- Semi-transparent backgrounds
- Subtle border glows

**Shadows & Glows:**
- Card shadow: `0 8px 32px rgba(0, 0, 0, 0.5)`
- Button glow: `0 0 20px rgba(0, 255, 130, 0.2)`
- Hover glow: `0 0 30px rgba(0, 255, 130, 0.3)`

**Gradients:**
- Button gradient: `linear-gradient(135deg, #00DC6E 0%, #00B85D 100%)`
- Page background: Multiple radial gradients with directional linear gradient

**Transitions:**
- Default: 0.2s ease
- Button hover: translateY(-1px)
- Smooth color transitions

### Responsive Design

**Desktop (default):**
- Card max-width: 400px
- Padding: 40px
- Full visual effects enabled

**Mobile (max-width: 480px):**
- Card padding: 24px
- Font size adjustments
- Touch-friendly button sizing
- Optimized spacing

---

## 🔄 Authentication Flow Diagram

```
User Visits Application
        |
        v
  Welcome Page
   /          \
  /            \
v               v
Member         Admin
Portal         Portal
 |              |
 +--Login       +--Login Only
 +--Signup      (No Signup)
   |
   +--Tab Navigation
      Active/Inactive States
```

### Complete User Journey - New Member

```
1. Welcome Page → Select "Member Login" (Sign In / Sign Up button)
2. User Login Tab → Click "Signup" tab
3. Signup Form → Fill name, email, password
4. Submit → POST /auth/signup
5. Success → Auto-login, redirect to /dashboard
6. Dashboard → Full member access
```

### Complete User Journey - Existing Member

```
1. Welcome Page → Select "Member Login" (Sign In / Sign Up button)
2. User Login Tab (Active) → Fill email, password
3. Submit → POST /auth/login
4. Success → Redirect to /dashboard
5. Dashboard → Full member access
```

### Complete User Journey - Admin

```
1. Welcome Page → Select "Admin Login" (Admin Portal button)
2. Admin Login (No Tabs) → Fill Admin ID, Password
3. Demo Credentials Shown → NBXADMIN01 / admin@123
4. Submit → POST /auth/admin-login
5. Success → Redirect to /dashboard
6. Dashboard → Full admin access
```

---

## 🛡️ Security Implementation

### Password Security
- **Hashing**: bcryptjs with salt rounds
- **Comparison**: Secure password comparison method
- **Never Stored**: Plain passwords never logged or displayed

### Token Security
- **JWT Tokens**: JSON Web Token with 7-day expiration
- **Environment Variable**: `JWT_SECRET` stored in .env
- **Header Storage**: Tokens sent in Authorization header
- **Auto Expiration**: Tokens expire after 7 days

### Admin Credentials
- **Environment Variables**: Stored in `.env` file
- **ADMIN_ID**: Unique admin identifier (e.g., NBXADMIN01)
- **ADMIN_PASSWORD**: Strong admin password
- **Never Hardcoded**: Never committed to repository

### Access Control
- **Role-Based**: Users assigned "admin" or "member" role
- **First User**: Automatically assigned "admin" role
- **Protected Routes**: All private routes check auth token
- **Middleware**: `protect` middleware validates JWT

---

## 🌐 Environment Variables

### Backend `.env` Configuration

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long
ADMIN_ID=NBXADMIN01
ADMIN_PASSWORD=admin@123

# CORS
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env` Configuration

```env
VITE_API_URL=http://localhost:5000
```

### Vercel Deployment

```env
VITE_API_URL=https://your-backend-url.railway.app
```

---

## 📱 Frontend Structure

### Component Hierarchy

```
App.jsx
├── Welcome.jsx (Public)
│   └── Welcome.css
├── UserLogin.jsx (Public)
│   └── AuthPages.css
├── UserSignup.jsx (Public)
│   └── AuthPages.css
├── AdminLogin.jsx (Public)
│   └── AuthPages.css
└── Layout.jsx (Private)
    ├── Dashboard.jsx
    ├── Projects.jsx
    ├── ProjectDetail.jsx
    └── Tasks.jsx
```

### Key Files

**[AuthContext.jsx](frontend/src/context/AuthContext.jsx)**
- Authentication state management
- `login(email, password)` - User login
- `signup(name, email, password)` - User registration
- `adminLogin(adminId, password)` - Admin authentication
- `logout()` - Clear auth state
- `user` state - Current authenticated user
- `loading` state - Loading indicator

**[AuthPages.css](frontend/src/pages/AuthPages.css)**
- Centralized styling for all auth pages
- Tab navigation styles
- Form field styling
- Button styling with glow effects
- Error banner styling
- Demo credentials box styling
- Responsive design

**[Welcome.jsx](frontend/src/pages/Welcome.jsx)**
- Landing page with portal selection
- Two-card layout for User/Admin portals
- Motivational tagline
- Responsive design

**[UserLogin.jsx](frontend/src/pages/UserLogin.jsx)**
- Member login form
- Tab navigation (Login | Signup)
- Email and password fields
- Navigation links

**[UserSignup.jsx](frontend/src/pages/UserSignup.jsx)**
- Member account creation
- Tab navigation (Login | Signup)
- Name, email, and password fields
- Automatic login on successful signup

**[AdminLogin.jsx](frontend/src/pages/AdminLogin.jsx)**
- Secure admin authentication
- Admin ID and password fields
- Demo credentials display
- No signup option

---

## 🔧 Backend Structure

### Authentication Routes

**[backend/routes/auth.js](backend/routes/auth.js)**

| Method | Endpoint | Body | Purpose |
|--------|----------|------|---------|
| POST | `/auth/signup` | `{name, email, password}` | Create new user account |
| POST | `/auth/login` | `{email, password}` | Authenticate existing user |
| POST | `/auth/admin-login` | `{adminId, password}` | Authenticate admin |
| GET | `/auth/me` | - | Get current user (protected) |
| GET | `/auth/users` | - | List all users (protected) |

### Database Schema

**User Model:**
```javascript
{
  _id: ObjectId,
  name: String (required, 2+ chars),
  email: String (required, unique, valid email),
  password: String (hashed, required),
  role: String (enum: ['admin', 'member']),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚀 Deployment

### Backend Deployment (Railway)

Environment variables to set:
```
PORT=5000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<strong-secret-key>
NODE_ENV=production
ADMIN_ID=NBXADMIN01
ADMIN_PASSWORD=admin@123
FRONTEND_URL=https://your-vercel-url.vercel.app
```

**Live URL**: `https://ethara-production-6802.up.railway.app`

### Frontend Deployment (Vercel)

Configuration:
- **vercel.json**: SPA rewrite rule to handle client-side routing
- **Environment Variable**: `VITE_API_URL=<your-backend-url>`

**Live URL**: `https://ethara-six.vercel.app`

---

## ✅ Testing Checklist

### Welcome Page
- [ ] Page displays with motivational tagline
- [ ] Two portal cards visible
- [ ] Links route to correct login pages
- [ ] Responsive on mobile

### Member Portal - Login
- [ ] Tab navigation visible and functional
- [ ] Login tab is active by default
- [ ] Email and password fields work
- [ ] Form validation displays errors
- [ ] Successful login redirects to dashboard
- [ ] Toast notification displays

### Member Portal - Signup
- [ ] Tab navigation visible and functional
- [ ] Signup tab can be selected
- [ ] Name, email, password fields work
- [ ] Form validation for each field
- [ ] Duplicate email shows error
- [ ] Successful signup auto-logs in and redirects
- [ ] First user becomes admin, rest become members

### Admin Portal
- [ ] No tab navigation visible
- [ ] Admin ID and password fields visible
- [ ] Demo credentials box displays
- [ ] Correct credentials authenticate user
- [ ] Invalid credentials show error
- [ ] Successful login redirects to dashboard
- [ ] No signup link available

### Dark Theme Consistency
- [ ] All pages use dark background
- [ ] Green accents (#00DC6E) consistent
- [ ] Cyan accents (#2DD4BF) used appropriately
- [ ] Cards have glassmorphism effect
- [ ] Text contrast is good (WCAG compliant)
- [ ] Hover states work smoothly

---

## 🐛 Troubleshooting

### Issue: Admin login returns 500 error
**Solution**: Ensure `ADMIN_ID` and `ADMIN_PASSWORD` environment variables are set in backend `.env`

### Issue: Member signup shows "Email already registered"
**Solution**: Check if email is already in database. Use different email for testing.

### Issue: Vercel shows 404 on page refresh
**Solution**: Ensure `vercel.json` has SPA rewrite rule configured

### Issue: Frontend can't connect to backend
**Solution**: Verify `VITE_API_URL` matches backend URL in frontend `.env`

### Issue: CSS not loading on auth pages
**Solution**: Ensure `AuthPages.css` is imported in component files

---

## 📚 Additional Resources

- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)
- [Project Structure](README.md)

---

## 📝 Recent Commits

| Commit Hash | Message |
|------------|---------|
| `e83f6c2` | Add tab navigation to member login/signup pages |
| `740f874` | Update authentication pages with compelling copy and messaging |
| `1bb867f` | Apply consistent dark theme to all authentication pages |
| `b36cce4` | Implement dual authentication system (User/Admin portals) |
| `8ce4bae` | Add SPA rewrite config for Vercel to fix 404 on refresh |
| `394dca7` | Implement role-based access control (Admin/Member) |

---

**Last Updated**: May 3, 2026  
**Version**: 2.0 - Dual Portal Authentication System

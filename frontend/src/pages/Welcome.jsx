import { Link } from 'react-router-dom';
import { PanelsTopLeft, User, Lock } from 'lucide-react';
import './Welcome.css';

export default function Welcome() {
  return (
    <div className="welcome-page">
      <div className="welcome-container">
        <div className="welcome-header">
          <div className="brand-mark"><PanelsTopLeft size={32} /></div>
          <h1>Team Task Manager</h1>
          <p>Manage projects, assign tasks, and track progress</p>
        </div>

        <div className="welcome-divider">Choose Your Role</div>

        <div className="login-options">
          <Link to="/user-login" className="login-card user-login">
            <div className="login-icon">
              <User size={40} />
            </div>
            <h2>User Login</h2>
            <p>View projects, apply to join teams, and collaborate</p>
            <div className="login-btn">Sign In / Sign Up</div>
          </Link>

          <Link to="/admin-login" className="login-card admin-login">
            <div className="login-icon">
              <Lock size={40} />
            </div>
            <h2>Admin Login</h2>
            <p>Create projects, manage teams, and oversee delivery</p>
            <div className="login-btn">Admin Portal</div>
          </Link>
        </div>

        <div className="welcome-footer">
          <p>© 2026 Team Task Manager. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

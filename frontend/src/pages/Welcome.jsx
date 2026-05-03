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
          <p>Plan with clarity, assign with purpose, and track every step — because great teams don't just work together, they deliver together.</p>
        </div>

        <div className="welcome-divider">Choose Your Role</div>

        <div className="login-options">
          <Link to="/user-login" className="login-card user-login">
            <div className="login-icon">
              <User size={40} />
            </div>
            <h2>Member Login</h2>
            <p>Collaborate with purpose—stay aligned, track progress, and drive results together</p>
            <div className="login-btn">Sign In / Sign Up</div>
          </Link>

          <Link to="/admin-login" className="login-card admin-login">
            <div className="login-icon">
              <Lock size={40} />
            </div>
            <h2>Admin Login</h2>
            <p>Lead with clarity—organize teams, delegate tasks, and oversee delivery with confidence</p>
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

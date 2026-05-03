import { Link } from 'react-router-dom';
import { Zap, Users, ShieldCheck } from 'lucide-react';
import './Welcome.css';

export default function Welcome() {
  return (
    <div className="welcome-page">
      <div className="welcome-container">
        <div className="welcome-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <div style={{
              width: 56, height: 56,
              background: 'var(--primary)',
              borderRadius: 16,
              display: 'grid', placeItems: 'center',
              color: '#fff',
              boxShadow: '0 0 32px var(--primary-glow)',
            }}>
              <Zap size={28} />
            </div>
          </div>
          <h1>Team Task Manager</h1>
          <p>Plan with clarity, assign with purpose, and track every step — because great teams don't just work together, they deliver together.</p>
        </div>

        <div className="welcome-divider">Choose Your Role</div>

        <div className="login-options">
          <Link to="/user-login" className="login-card user-login">
            <div className="login-icon">
              <Users size={32} />
            </div>
            <h2>Member Login</h2>
            <p>Collaborate with purpose — stay aligned, track progress, and drive results together</p>
            <div className="login-btn">Sign In / Sign Up</div>
          </Link>

          <Link to="/admin-login" className="login-card admin-login">
            <div className="login-icon">
              <ShieldCheck size={32} />
            </div>
            <h2>Admin Login</h2>
            <p>Lead with clarity — organize teams, delegate tasks, and oversee delivery with confidence</p>
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

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, ShieldCheck, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

export default function AdminLogin() {
  const [form, setForm] = useState({ adminId: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await adminLogin(form.adminId, form.password);
      toast.success('Admin login successful!');
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Admin login failed';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left — Hero */}
      <div className="auth-hero">
        <div className="auth-hero-brand">
          <div className="auth-hero-brand-mark"><Zap size={20} /></div>
          <div>
            <div className="auth-hero-brand-name">Team Task Manager</div>
            <div className="auth-hero-brand-sub">Admin workspace</div>
          </div>
        </div>

        <div className="auth-hero-content">
          <div className="auth-hero-quote">
            Lead with <span>clarity.</span> Deliver with <span>confidence.</span>
          </div>
          <p className="auth-hero-desc">
            Organize teams, create projects, assign tasks, and oversee every delivery from your centralized admin dashboard.
          </p>
        </div>

        <div className="auth-hero-stats">
          <div>
            <div className="auth-hero-stat-value">Full</div>
            <div className="auth-hero-stat-label">Control</div>
          </div>
          <div>
            <div className="auth-hero-stat-value">Team</div>
            <div className="auth-hero-stat-label">Management</div>
          </div>
          <div>
            <div className="auth-hero-stat-value">Role-based</div>
            <div className="auth-hero-stat-label">Permissions</div>
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-brand">
            <div className="brand-mark" style={{ background: 'var(--accent)' }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h1 className="auth-title">Admin Portal</h1>
              <p className="auth-subtitle">Sign in with your admin credentials to manage the workspace</p>
            </div>
          </div>

          {error && (
            <div className="error-banner">
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="field-group">
              <label>Admin ID</label>
              <input type="text" value={form.adminId} onChange={(e) => setForm({ ...form, adminId: e.target.value })} required className="field" placeholder="e.g., NBXADMIN01" />
            </div>
            <div className="field-group">
              <label>Password</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required className="field" placeholder="Enter admin password" />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: 8, minHeight: 42 }}>
              {loading ? 'Signing in...' : 'Admin Sign In'}
            </button>
          </form>

          <div className="demo-credentials">
            <strong>Demo Credentials</strong><br />
            Admin ID: NBXADMIN01<br />
            Password: admin@123
          </div>

          <p className="auth-link">
            Not an admin? <Link to="/user-login">Member login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

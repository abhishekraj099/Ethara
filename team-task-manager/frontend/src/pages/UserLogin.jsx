import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

export default function UserLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
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
            <div className="auth-hero-brand-sub">Collaborative workspace</div>
          </div>
        </div>

        <div className="auth-hero-content">
          <div className="auth-hero-quote">
            Great teams don't just <span>work together</span> — they <span>deliver together.</span>
          </div>
          <p className="auth-hero-desc">
            Plan with clarity, assign with purpose, and track every step of your project delivery in one focused workspace.
          </p>
        </div>

        <div className="auth-hero-stats">
          <div>
            <div className="auth-hero-stat-value">100%</div>
            <div className="auth-hero-stat-label">Visibility</div>
          </div>
          <div>
            <div className="auth-hero-stat-value">Real-time</div>
            <div className="auth-hero-stat-label">Updates</div>
          </div>
          <div>
            <div className="auth-hero-stat-value">Role-based</div>
            <div className="auth-hero-stat-label">Access control</div>
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-tabs">
            <Link to="/user-login" className="auth-tab active">Login</Link>
            <Link to="/user-signup" className="auth-tab">Signup</Link>
          </div>

          <div className="auth-brand">
            <div className="brand-mark"><Users size={20} /></div>
            <div>
              <h1 className="auth-title">Member Login</h1>
              <p className="auth-subtitle">Sign in to view and manage your assigned tasks</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="field-group">
              <label>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="field" placeholder="you@example.com" />
            </div>
            <div className="field-group">
              <label>Password</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required className="field" placeholder="Enter your password" />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: 8, minHeight: 42 }}>
              {loading ? 'Signing in...' : 'Sign In as Member'}
            </button>
          </form>

          <p className="auth-link">
            Admin? <Link to="/admin-login">Go to Admin Portal</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

export default function UserSignup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      toast.success('Account created! You are logged in.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Signup failed');
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
            Your journey to <span>better teamwork</span> starts with a <span>single step.</span>
          </div>
          <p className="auth-hero-desc">
            Join your team today. Collaborate on projects, get tasks assigned to you, and track your delivery in real time.
          </p>
        </div>

        <div className="auth-hero-stats">
          <div>
            <div className="auth-hero-stat-value">Free</div>
            <div className="auth-hero-stat-label">To join</div>
          </div>
          <div>
            <div className="auth-hero-stat-value">Instant</div>
            <div className="auth-hero-stat-label">Access</div>
          </div>
          <div>
            <div className="auth-hero-stat-value">Team</div>
            <div className="auth-hero-stat-label">Collaboration</div>
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-tabs">
            <Link to="/user-login" className="auth-tab">Login</Link>
            <Link to="/user-signup" className="auth-tab active">Signup</Link>
          </div>

          <div className="auth-brand">
            <div className="brand-mark"><UserPlus size={20} /></div>
            <div>
              <h1 className="auth-title">Create Account</h1>
              <p className="auth-subtitle">Join your team and start collaborating today</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name' },
              { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
              { key: 'password', label: 'Password', type: 'password', placeholder: 'Create a strong password' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key} className="field-group">
                <label>{label}</label>
                <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required className="field" placeholder={placeholder} />
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: 8, minHeight: 42 }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="auth-link">Already have an account? <Link to="/user-login">Sign in</Link></p>
          <p className="auth-link">Admin? <Link to="/admin-login">Admin portal</Link></p>
        </div>
      </div>
    </div>
  );
}

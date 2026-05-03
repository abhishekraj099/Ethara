import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PanelsTopLeft } from 'lucide-react';
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
      <div className="auth-card">
        <div className="auth-tabs">
          <Link to="/user-login" className="auth-tab active">Login</Link>
          <Link to="/user-signup" className="auth-tab">Signup</Link>
        </div>

        <div className="auth-brand">
          <div className="brand-mark"><PanelsTopLeft size={22} /></div>
          <div>
            <h1 className="auth-title">Member Login</h1>
            <p className="auth-subtitle">Collaborate with purpose—stay aligned, track progress, and drive results</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {['email', 'password'].map((field) => (
            <div key={field} className="field-group">
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                type={field}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                required
                className="field"
                placeholder={field === 'email' ? 'you@example.com' : 'Enter password'}
              />
            </div>
          ))}

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-link">
          Admin? <Link to="/admin-login">Admin portal</Link>
        </p>
      </div>
    </div>
  );
}

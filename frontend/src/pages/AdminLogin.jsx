import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PanelsTopLeft, Lock, AlertCircle } from 'lucide-react';
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
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-mark"><PanelsTopLeft size={22} /></div>
          <div>
            <h1 className="auth-title">Admin Portal</h1>
            <p className="auth-subtitle">Lead with clarity—organize teams, delegate tasks, and oversee delivery with confidence</p>
          </div>
        </div>

        {error && (
          <div className="error-banner">
            <AlertCircle size={18} />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field-group">
            <label>Admin ID</label>
            <input
              type="text"
              value={form.adminId}
              onChange={(e) => setForm({ ...form, adminId: e.target.value })}
              required
              className="field"
              placeholder="e.g., NBXADMIN01"
            />
          </div>

          <div className="field-group">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="field"
              placeholder="Enter admin password"
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>
            {loading ? 'Signing in...' : 'Admin Sign In'}
          </button>
        </form>

        <div className="demo-credentials">
          <strong>Demo Credentials:</strong><br/>
          Admin ID: NBXADMIN01<br/>
          Password: admin@123
        </div>

        <p className="auth-link">
          Not an admin? <Link to="/user-login">User login</Link>
        </p>
      </div>
    </div>
  );
}

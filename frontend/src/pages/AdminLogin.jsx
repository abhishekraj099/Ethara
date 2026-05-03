import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PanelsTopLeft, Lock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

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
            <p className="auth-subtitle">Secure admin access with credentials</p>
          </div>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px',
            display: 'flex',
            gap: '8px',
            alignItems: 'flex-start',
            color: '#dc2626'
          }}>
            <AlertCircle size={18} style={{ marginTop: '2px', flexShrink: 0 }} />
            <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
              {error}
            </div>
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

        <div style={{ 
          marginTop: '20px',
          padding: '12px',
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#0369a1',
          lineHeight: '1.5'
        }}>
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

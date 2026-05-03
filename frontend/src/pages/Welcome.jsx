import { Link } from 'react-router-dom';
import { Users, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

export default function Welcome() {
  return (
    <div className="auth-page">
      {/* ── Left Panel — Dark Green Hero ── */}
      <div className="auth-hero">
        {/* Brand */}
        <div className="auth-hero-brand">
          <div className="auth-hero-brand-mark">
            <Zap size={20} />
          </div>
          <div>
            <div className="auth-hero-brand-name">Team Task Manager</div>
            <div className="auth-hero-brand-sub">Collaborative workspace</div>
          </div>
        </div>

        {/* Quote */}
        <div className="auth-hero-content">
          <div className="auth-hero-quote">
            Great teams don't just <span>work together</span> — they{' '}
            <span>deliver together.</span>
          </div>
          <p className="auth-hero-desc">
            Plan with clarity, assign with purpose, and track every step of your
            project delivery — all in one focused workspace built for real teams.
          </p>
        </div>

        {/* Stats */}
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

      {/* ── Right Panel — Role Selection ── */}
      <div className="auth-form-panel">
        <div className="auth-card">
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 52, height: 52, background: 'var(--primary-soft)', borderRadius: 16, display: 'grid', placeItems: 'center', color: 'var(--primary)', margin: '0 auto 16px' }}>
              <Zap size={24} />
            </div>
            <h1 className="auth-title" style={{ fontSize: 24 }}>Choose Your Role</h1>
            <p className="auth-subtitle">Select how you'd like to access the workspace</p>
          </div>

          {/* Member Card */}
          <Link to="/user-login" style={{ textDecoration: 'none', display: 'block', marginBottom: 14 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '20px', borderRadius: 12,
              border: '1.5px solid var(--border)',
              background: 'var(--bg)',
              transition: 'all 0.2s',
              cursor: 'pointer',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(22,163,74,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ width: 48, height: 48, background: 'var(--primary-soft)', borderRadius: 12, display: 'grid', placeItems: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                <Users size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 2 }}>Member Login</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>View assigned projects, manage tasks, update status</div>
              </div>
              <ArrowRight size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            </div>
          </Link>

          {/* Admin Card */}
          <Link to="/admin-login" style={{ textDecoration: 'none', display: 'block', marginBottom: 28 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '20px', borderRadius: 12,
              border: '1.5px solid var(--border)',
              background: 'var(--bg)',
              transition: 'all 0.2s',
              cursor: 'pointer',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(5,150,105,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ width: 48, height: 48, background: 'var(--accent-soft)', borderRadius: 12, display: 'grid', placeItems: 'center', color: 'var(--accent)', flexShrink: 0 }}>
                <ShieldCheck size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 2 }}>Admin Login</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Manage all projects, approve requests, assign tasks</div>
              </div>
              <ArrowRight size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
            </div>
          </Link>

          {/* Divider */}
          <div style={{ textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: 20 }}>
            <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>
              New here?{' '}
              <Link to="/user-signup" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                Create a member account →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

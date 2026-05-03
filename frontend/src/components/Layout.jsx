import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { CheckSquare, FolderKanban, LayoutDashboard, LogOut, Zap, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = isAdmin
    ? [
        { to: '/dashboard', icon: <LayoutDashboard size={17} />, label: 'Dashboard' },
        { to: '/projects',  icon: <FolderKanban size={17} />,    label: 'All Projects' },
        { to: '/tasks',     icon: <CheckSquare size={17} />,      label: 'All Tasks' },
      ]
    : [
        { to: '/dashboard', icon: <LayoutDashboard size={17} />, label: 'Dashboard' },
        { to: '/projects',  icon: <FolderKanban size={17} />,    label: 'My Projects' },
        { to: '/tasks',     icon: <CheckSquare size={17} />,      label: 'My Tasks' },
      ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        {/* Brand */}
        <div className="brand">
          <div className="brand-mark">
            <Zap size={18} />
          </div>
          <div>
            <div className="brand-title">TaskFlow</div>
            <div className="brand-subtitle">Team workspace</div>
          </div>
        </div>

        {/* Role Badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '8px 12px', borderRadius: 8, marginBottom: 8,
          background: isAdmin ? 'rgba(22,163,74,0.15)' : 'rgba(99,102,241,0.1)',
          border: `1px solid ${isAdmin ? 'rgba(134,239,172,0.25)' : 'rgba(167,139,250,0.2)'}`,
        }}>
          {isAdmin
            ? <ShieldCheck size={14} style={{ color: '#86efac' }} />
            : <User size={14} style={{ color: '#a78bfa' }} />}
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: isAdmin ? '#86efac' : '#a78bfa' }}>
            {isAdmin ? 'Administrator' : 'Member'}
          </span>
        </div>

        {/* Nav */}
        <nav className="nav-list">
          {navItems.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} className="nav-link">
              {icon} {label}
            </NavLink>
          ))}
        </nav>



        {/* User Footer */}
        <div className="sidebar-footer">
          <div className="user-name">{user?.name}</div>
          <div className="user-role">{user?.role}</div>
          <button onClick={handleLogout} className="btn btn-danger" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}

import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { CheckSquare, FolderKanban, LayoutDashboard, LogOut, PanelsTopLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><PanelsTopLeft size={22} /></div>
          <div>
            <div className="brand-title">TaskManager</div>
            <div className="brand-subtitle">Team work cockpit</div>
          </div>
        </div>

        <nav className="nav-list">
          {[
            { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
            { to: '/projects', icon: <FolderKanban size={18} />, label: 'Projects' },
            { to: '/tasks', icon: <CheckSquare size={18} />, label: 'My Tasks' },
          ].map(({ to, icon, label }) => (
            <NavLink key={to} to={to} className="nav-link">
              {icon} {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-name">{user?.name}</div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <div className="user-role">{user?.role}</div>
            {user?.role === 'admin' && (
              <span style={{
                background: 'linear-gradient(135deg, #2dd4bf 0%, #3b82f6 100%)',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase'
              }}>
                ⭐ System
              </span>
            )}
          </div>
          <button onClick={handleLogout} className="btn btn-danger">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}

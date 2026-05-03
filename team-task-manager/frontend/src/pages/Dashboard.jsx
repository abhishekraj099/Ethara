import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Clock3, ListChecks, ArrowRight, ShieldCheck, User, FolderKanban } from 'lucide-react';
import { taskAPI } from '../api';
import { useAuth } from '../context/AuthContext';

const statusColor  = { todo: '#94a3b8', 'in-progress': '#a855f7', review: '#f59e0b', done: '#10b981' };
const priorityColor = { low: '#94a3b8', medium: '#f59e0b', high: '#ef4444' };

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    taskAPI.getDashboard()
      .then((r) => setStats(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="page">
      <div style={{ color: 'var(--text-muted)', padding: 40 }}>Loading dashboard...</div>
    </div>
  );

  const cards = isAdmin ? [
    { label: 'Total Tasks',  value: stats?.total || 0,      icon: <ListChecks size={18} />,   color: 'var(--primary)', soft: 'var(--primary-soft)' },
    { label: 'In Progress',  value: stats?.inProgress || 0, icon: <Clock3 size={18} />,        color: 'var(--purple)',  soft: 'var(--purple-soft)' },
    { label: 'Completed',    value: stats?.done || 0,        icon: <CheckCircle2 size={18} />, color: 'var(--success)', soft: 'var(--success-soft)' },
    { label: 'Overdue',      value: stats?.overdue || 0,     icon: <AlertTriangle size={18} />,color: 'var(--danger)',  soft: 'var(--danger-soft)' },
  ] : [
    { label: 'My Tasks',     value: stats?.total || 0,      icon: <ListChecks size={18} />,   color: 'var(--primary)', soft: 'var(--primary-soft)' },
    { label: 'In Progress',  value: stats?.inProgress || 0, icon: <Clock3 size={18} />,        color: 'var(--purple)',  soft: 'var(--purple-soft)' },
    { label: 'Completed',    value: stats?.done || 0,        icon: <CheckCircle2 size={18} />, color: 'var(--success)', soft: 'var(--success-soft)' },
    { label: 'Overdue',      value: stats?.overdue || 0,     icon: <AlertTriangle size={18} />,color: 'var(--danger)',  soft: 'var(--danger-soft)' },
  ];

  return (
    <div className="page">
      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <div className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {isAdmin
              ? <><ShieldCheck size={13} /> Admin Dashboard — Global Overview</>
              : <><User size={13} /> Member Dashboard — My Work</>}
          </div>
          <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="page-subtitle">
            {isAdmin
              ? 'Full system overview — all tasks, all projects, all members across the platform.'
              : 'Your personal workspace — track your assigned tasks, progress, and deadlines.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <Link to="/projects" className="btn btn-primary">
            {isAdmin ? 'Manage Projects' : 'My Projects'} <ArrowRight size={15} />
          </Link>
          {!isAdmin && (
            <Link to="/tasks" className="btn btn-secondary">
              My Tasks <ArrowRight size={15} />
            </Link>
          )}
        </div>
      </div>

      {/* ── Role Info Banner ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 18px', borderRadius: 10, marginBottom: 24,
        background: isAdmin ? 'var(--primary-soft)' : '#f0fdf4',
        border: `1px solid ${isAdmin ? '#86efac' : '#bbf7d0'}`,
        fontSize: 13, color: isAdmin ? 'var(--primary-dark)' : '#166534',
      }}>
        {isAdmin ? <ShieldCheck size={16} /> : <User size={16} />}
        <span>
          {isAdmin
            ? <><strong>Admin Access:</strong> You can manage all users, projects, and tasks. Approve member project requests from the Projects page.</>
            : <><strong>Member Access:</strong> You can create projects (needs admin approval), view assigned tasks, and update task status.</>}
        </span>
      </div>

      {/* ── Stat Cards ── */}
      <div className="stat-grid">
        {cards.map((card) => (
          <div key={card.label} className="stat-card">
            <div className="stat-icon" style={{ background: card.soft, color: card.color }}>
              {card.icon}
            </div>
            <div className="stat-value" style={{ color: card.color }}>{card.value}</div>
            <div className="stat-label">{card.label}</div>
          </div>
        ))}
      </div>

      {/* ── Recent Tasks Table ── */}
      <div className="glass-card">
        <div className="section-title">
          <h2>{isAdmin ? '🌐 All Recent Tasks' : '📋 My Recent Tasks'}</h2>
          <Link to="/tasks" className="text-link" style={{ fontSize: 13 }}>
            {isAdmin ? 'View all tasks →' : 'View my tasks →'}
          </Link>
        </div>

        {!stats?.recentTasks?.length && (
          <div className="empty-state">
            {isAdmin ? 'No tasks in the system yet.' : 'No tasks assigned to you yet.'}
          </div>
        )}

        <div className="list">
          {stats?.recentTasks?.map((task) => (
            <div key={task._id} className="list-row">
              <div style={{ width: 3, height: 40, borderRadius: 4, background: priorityColor[task.priority], flexShrink: 0 }} />
              <div className="row-main">
                <div className="row-title">{task.title}</div>
                <div className="meta" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 2 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FolderKanban size={11} /> {task.project?.name || 'No project'}
                  </span>
                  {/* Admin sees who the task is assigned to */}
                  {isAdmin && task.assignedTo && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--primary)', fontWeight: 600 }}>
                      <User size={11} /> {task.assignedTo?.name || 'Unassigned'}
                    </span>
                  )}
                  {task.dueDate && (
                    <span style={{ color: task.isOverdue ? 'var(--danger)' : 'var(--text-muted)' }}>
                      Due {new Date(task.dueDate).toLocaleDateString()}{task.isOverdue ? ' · OVERDUE' : ''}
                    </span>
                  )}
                </div>
              </div>
              <div className="row-actions">
                <span className="badge" style={{ color: priorityColor[task.priority], background: `${priorityColor[task.priority]}1a` }}>
                  {task.priority}
                </span>
                <span className="badge" style={{ color: statusColor[task.status], background: `${statusColor[task.status]}1a` }}>
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick Actions (Member only) ── */}
      {!isAdmin && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 20 }}>
          <Link to="/projects" className="glass-card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
            <div style={{ width: 44, height: 44, background: 'var(--primary-soft)', borderRadius: 12, display: 'grid', placeItems: 'center', color: 'var(--primary)', flexShrink: 0 }}>
              <FolderKanban size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14 }}>Submit a Project</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Create a project request for admin approval</div>
            </div>
          </Link>
          <Link to="/tasks" className="glass-card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
            <div style={{ width: 44, height: 44, background: 'var(--success-soft)', borderRadius: 12, display: 'grid', placeItems: 'center', color: 'var(--success)', flexShrink: 0 }}>
              <ListChecks size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14 }}>Update Task Status</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Move your tasks from pending → done</div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}

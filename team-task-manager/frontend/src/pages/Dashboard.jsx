import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Clock3, ListChecks } from 'lucide-react';
import { taskAPI } from '../api';
import { useAuth } from '../context/AuthContext';

const statusColor = { todo: '#94A3B8', 'in-progress': '#E879F9', review: '#FBBF24', done: '#6EE7B7' };
const priorityColor = { low: '#94A3B8', medium: '#FBBF24', high: '#FB7185' };

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    taskAPI.getDashboard()
      .then((r) => setStats(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page"><div className="glass-card">Loading dashboard...</div></div>;

  const cards = [
    { label: 'Total Tasks', value: stats?.total || 0, icon: <ListChecks size={19} />, accent: '#2DD4BF', soft: 'rgba(45, 212, 191, 0.12)' },
    { label: 'In Progress', value: stats?.inProgress || 0, icon: <Clock3 size={19} />, accent: '#E879F9', soft: 'rgba(232, 121, 249, 0.12)' },
    { label: 'Completed', value: stats?.done || 0, icon: <CheckCircle2 size={19} />, accent: '#6EE7B7', soft: 'rgba(110, 231, 183, 0.12)' },
    { label: 'Overdue', value: stats?.overdue || 0, icon: <AlertTriangle size={19} />, accent: '#FB7185', soft: 'rgba(251, 113, 133, 0.12)' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="eyebrow">Dashboard</div>
          <h1 className="page-title">Welcome back, {user?.name}</h1>
          <p className="page-subtitle">Track ownership, delivery status, and urgent work from one focused workspace.</p>
        </div>
        <Link to="/projects" className="btn btn-primary">Open Projects</Link>
      </div>

      <div className="stat-grid">
        {cards.map((card) => (
          <div
            key={card.label}
            className="stat-card"
            style={{ '--accent': card.accent, '--accent-soft': card.soft }}
          >
            <div className="stat-icon">{card.icon}</div>
            <div className="stat-value">{card.value}</div>
            <div className="stat-label">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="glass-card">
        <div className="section-title">
          <h2>Recent Tasks</h2>
          <Link to="/tasks" className="text-link">View all tasks</Link>
        </div>

        {!stats?.recentTasks?.length && <div className="empty-state">No tasks yet. Create a project and assign the first task.</div>}

        <div className="list">
          {stats?.recentTasks?.map((task) => (
            <div key={task._id} className="list-row">
              <div className="row-main">
                <div className="row-title">{task.title}</div>
                <div className="meta">
                  {task.project?.name || 'No project'}
                  {task.dueDate ? ` · Due ${new Date(task.dueDate).toLocaleDateString()}` : ''}
                </div>
              </div>
              <div className="row-actions">
                <span className="badge" style={{ color: priorityColor[task.priority], background: `${priorityColor[task.priority]}18` }}>
                  {task.priority}
                </span>
                <span className="badge" style={{ color: statusColor[task.status], background: `${statusColor[task.status]}18` }}>
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

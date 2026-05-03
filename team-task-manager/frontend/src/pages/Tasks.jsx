import { useEffect, useState } from 'react';
import { CalendarDays, FolderKanban } from 'lucide-react';
import { taskAPI } from '../api';

const statusColor = { todo: '#94A3B8', 'in-progress': '#E879F9', review: '#FBBF24', done: '#6EE7B7' };
const priorityColor = { low: '#94A3B8', medium: '#FBBF24', high: '#FB7185' };

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');

  const load = () => taskAPI.getMy().then((r) => setTasks(r.data));

  useEffect(() => {
    load();
  }, []);

  const filtered = filter === 'all'
    ? tasks
    : filter === 'overdue'
      ? tasks.filter((t) => t.isOverdue)
      : tasks.filter((t) => t.status === filter);

  const handleStatusChange = async (id, status) => {
    await taskAPI.update(id, { status });
    load();
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="eyebrow">My Tasks</div>
          <h1 className="page-title">Assigned work</h1>
          <p className="page-subtitle">Filter your queue, update progress, and keep overdue work visible.</p>
        </div>
      </div>

      <div className="filter-bar">
        {['all', 'todo', 'in-progress', 'review', 'done', 'overdue'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`filter-chip ${filter === f ? 'active' : ''}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="glass-card">
        {!filtered.length && <div className="empty-state">No tasks found for this filter.</div>}
        <div className="list">
          {filtered.map((task) => (
            <div key={task._id} className="list-row">
              <div style={{ width: 4, height: 44, borderRadius: 8, background: priorityColor[task.priority], flexShrink: 0 }} />
              <div className="row-main">
                <div className="row-title">{task.title}</div>
                <div className="meta" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
                  <span><FolderKanban size={13} /> {task.project?.name || 'No project'}</span>
                  {task.dueDate && <span><CalendarDays size={13} /> {new Date(task.dueDate).toLocaleDateString()}</span>}
                  {task.isOverdue && <span style={{ color: '#dc2626', fontWeight: 800 }}>OVERDUE</span>}
                </div>
              </div>
              <div className="row-actions">
                <select value={task.status} onChange={(e) => handleStatusChange(task._id, e.target.value)} className="select" style={{ minWidth: 140, color: statusColor[task.status] }}>
                  {['todo', 'in-progress', 'review', 'done'].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <span className="badge" style={{ color: priorityColor[task.priority], background: `${priorityColor[task.priority]}18` }}>
                  {task.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

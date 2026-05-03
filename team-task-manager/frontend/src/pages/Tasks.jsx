import { useEffect, useState } from 'react';
import { CalendarDays, FolderKanban, User, ShieldCheck } from 'lucide-react';
import { taskAPI } from '../api';
import { useAuth } from '../context/AuthContext';

const statusColor  = { todo: '#94a3b8', 'in-progress': '#a855f7', review: '#f59e0b', done: '#10b981' };
const priorityColor = { low: '#94a3b8', medium: '#f59e0b', high: '#ef4444' };
const statusSteps   = ['todo', 'in-progress', 'review', 'done'];

// A simple visual stepper for member status update
function StatusStepper({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 0, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
      {statusSteps.map((s) => {
        const active = s === value;
        return (
          <button
            key={s}
            onClick={() => onChange(s)}
            style={{
              flex: 1, padding: '6px 4px', fontSize: 10, fontWeight: 700,
              textTransform: 'capitalize', cursor: 'pointer', border: 'none',
              background: active ? statusColor[s] : 'var(--surface2)',
              color: active ? '#fff' : 'var(--text-muted)',
              transition: 'all 0.15s',
              borderRight: '1px solid var(--border)',
            }}
            title={s}
          >
            {s.replace('-', ' ')}
          </button>
        );
      })}
    </div>
  );
}

export default function Tasks() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [tasks, setTasks]   = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    // Admin: fetch ALL tasks. Member: fetch only their tasks.
    const fetch = isAdmin
      ? taskAPI.getAll({})          // all tasks
      : taskAPI.getMy();            // only assigned to me
    fetch.then((r) => setTasks(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = filter === 'all'
    ? tasks
    : filter === 'overdue'
      ? tasks.filter((t) => t.isOverdue)
      : tasks.filter((t) => t.status === filter);

  const handleStatusChange = async (id, status) => {
    await taskAPI.update(id, { status });
    load();
  };

  const filterOptions = ['all', 'todo', 'in-progress', 'review', 'done', 'overdue'];

  return (
    <div className="page">
      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <div className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {isAdmin
              ? <><ShieldCheck size={13} /> Admin View — All System Tasks</>
              : <><User size={13} /> Member View — My Assigned Tasks</>}
          </div>
          <h1 className="page-title">{isAdmin ? 'All Tasks' : 'My Tasks'}</h1>
          <p className="page-subtitle">
            {isAdmin
              ? 'Global task list — see every task across all projects, assignees, and statuses.'
              : 'Your assigned work queue. Update your task status as you make progress.'}
          </p>
        </div>
        {/* Member: visual status guide */}
        {!isAdmin && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: 'var(--text-muted)' }}>
            <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Status Flow</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {statusSteps.map((s, i) => (
                <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ padding: '2px 8px', borderRadius: 99, background: `${statusColor[s]}1a`, color: statusColor[s], fontWeight: 700, fontSize: 10, textTransform: 'capitalize' }}>
                    {s.replace('-', ' ')}
                  </span>
                  {i < statusSteps.length - 1 && <span style={{ color: 'var(--text-dim)' }}>→</span>}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Stats bar (admin only) ── */}
      {isAdmin && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          {statusSteps.map((s) => {
            const count = tasks.filter(t => t.status === s).length;
            return (
              <div key={s} style={{ flex: 1, minWidth: 100, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px', textAlign: 'center', borderTop: `3px solid ${statusColor[s]}` }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: statusColor[s] }}>{count}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize', fontWeight: 600, marginTop: 2 }}>{s.replace('-', ' ')}</div>
              </div>
            );
          })}
          <div style={{ flex: 1, minWidth: 100, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px', textAlign: 'center', borderTop: '3px solid var(--danger)' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--danger)' }}>{tasks.filter(t => t.isOverdue).length}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginTop: 2 }}>Overdue</div>
          </div>
        </div>
      )}

      {/* ── Filter chips ── */}
      <div className="filter-bar">
        {filterOptions.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`filter-chip ${filter === f ? 'active' : ''}`}>
            {f} {f !== 'all' && f !== 'overdue' && (
              <span style={{ opacity: 0.7, fontSize: 10 }}>
                ({tasks.filter(t => t.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Task List ── */}
      <div className="glass-card">
        {loading && <div style={{ color: 'var(--text-muted)', padding: 20 }}>Loading tasks...</div>}
        {!loading && !filtered.length && (
          <div className="empty-state">
            {filter === 'all'
              ? (isAdmin ? 'No tasks in the system yet.' : 'No tasks assigned to you yet.')
              : `No tasks with status "${filter}".`}
          </div>
        )}

        <div className="list">
          {filtered.map((task) => (
            <div key={task._id} className="list-row" style={{ alignItems: 'flex-start', paddingTop: 14, paddingBottom: 14 }}>
              {/* Priority bar */}
              <div style={{ width: 3, height: 50, borderRadius: 4, background: priorityColor[task.priority], flexShrink: 0, marginTop: 2 }} />

              <div className="row-main">
                <div className="row-title">{task.title}</div>
                <div className="meta" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FolderKanban size={11} /> {task.project?.name || 'No project'}
                  </span>
                  {/* Admin sees the assignee */}
                  {isAdmin && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--primary)', fontWeight: 600 }}>
                      <User size={11} />
                      {task.assignedTo?.name || <span style={{ color: 'var(--text-dim)' }}>Unassigned</span>}
                    </span>
                  )}
                  {task.dueDate && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: task.isOverdue ? 'var(--danger)' : undefined }}>
                      <CalendarDays size={11} />
                      {new Date(task.dueDate).toLocaleDateString()}
                      {task.isOverdue && <span style={{ fontWeight: 800, fontSize: 10 }}> · OVERDUE</span>}
                    </span>
                  )}
                </div>

                {/* Member: status stepper (visual progress update) */}
                {!isAdmin && task.assignedTo?._id === user?._id && (
                  <div style={{ marginTop: 10 }}>
                    <StatusStepper value={task.status} onChange={(s) => handleStatusChange(task._id, s)} />
                  </div>
                )}
              </div>

              <div className="row-actions" style={{ flexShrink: 0 }}>
                <span className="badge" style={{ color: priorityColor[task.priority], background: `${priorityColor[task.priority]}1a` }}>
                  {task.priority}
                </span>
                {/* Admin: dropdown select */}
                {isAdmin ? (
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    className="select"
                    style={{ minWidth: 130, fontSize: 12, color: statusColor[task.status], padding: '6px 10px', fontWeight: 700 }}
                  >
                    {statusSteps.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                ) : (
                  <span className="badge" style={{ color: statusColor[task.status], background: `${statusColor[task.status]}1a` }}>
                    {task.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

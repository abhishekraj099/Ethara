import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Trash2, UserPlus, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI, projectAPI, taskAPI } from '../api';
import { useAuth } from '../context/AuthContext';

const statusColor = { todo: '#94a3b8', 'in-progress': '#a855f7', review: '#f59e0b', done: '#10b981' };
const priorityColor = { low: '#94a3b8', medium: '#f59e0b', high: '#ef4444' };
const columns = ['todo', 'in-progress', 'review', 'done'];

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '', status: 'todo' });
  const [memberForm, setMemberForm] = useState({ userId: '', role: 'member' });
  const [assignForm, setAssignForm] = useState({ userId: '', role: 'member' });

  const loadProject = () => projectAPI.getOne(id).then((r) => setProject(r.data));
  const loadTasks = () => taskAPI.getAll({ project: id }).then((r) => setTasks(r.data));

  useEffect(() => {
    loadProject();
    loadTasks();
    authAPI.getUsers().then((r) => setUsers(r.data));
  }, [id]);

  const isAdmin = project?.owner?._id === user?._id ||
    project?.members?.find((m) => m.user?._id === user?._id)?.role === 'admin' ||
    user?.role === 'admin';

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await taskAPI.create({ ...taskForm, project: id });
      toast.success('Task created!');
      setTaskForm({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '', status: 'todo' });
      setShowTaskForm(false);
      loadTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await taskAPI.update(taskId, { status });
      loadTasks();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleReassignTask = async (taskId, assignedTo) => {
    try {
      await taskAPI.update(taskId, { assignedTo: assignedTo || null });
      toast.success(assignedTo ? 'Task reassigned!' : 'Task unassigned');
      loadTasks();
    } catch {
      toast.error('Failed to reassign task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Delete task?')) return;
    try {
      await taskAPI.delete(taskId);
      toast.success('Task deleted');
      loadTasks();
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await projectAPI.addMember(id, memberForm);
      toast.success('Member added!');
      setMemberForm({ userId: '', role: 'member' });
      setShowMemberForm(false);
      loadProject();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleAssignMember = async (e) => {
    e.preventDefault();
    try {
      await projectAPI.assignMember(id, assignForm);
      toast.success('Member assigned!');
      setAssignForm({ userId: '', role: 'member' });
      setShowAssignForm(false);
      loadProject();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign member');
    }
  };

  const handleApproveMember = async (userId) => {
    try {
      await projectAPI.approveMember(id, userId);
      toast.success('Member approved!');
      loadProject();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve member');
    }
  };

  const handleRejectMember = async (userId) => {
    try {
      await projectAPI.rejectMember(id, userId);
      toast.success('Member request rejected');
      loadProject();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject member');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!confirm('Remove this member from the project?')) return;
    try {
      await projectAPI.removeMember(id, userId);
      toast.success('Member removed!');
      loadProject();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove member');
    }
  };

  if (!project) return (
    <div className="page">
      <div style={{ color: 'var(--text-muted)', padding: 40 }}>Loading project...</div>
    </div>
  );

  const pendingCount = project.pendingMembers?.filter(p => p.status === 'pending').length || 0;

  return (
    <div className="page">
      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <div className="eyebrow">Project</div>
          <h1 className="page-title">{project.name}</h1>
          <p className="page-subtitle">{project.description || 'No description added.'}</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowTaskForm(!showTaskForm)} className="btn btn-primary">
            <Plus size={16} /> Add Task
          </button>
        )}
      </div>

      {/* ── Team Members ── */}
      <div className="glass-card" style={{ marginBottom: 16 }}>
        <div className="section-title">
          <h2>Team Members <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 14 }}>({project.members?.length || 0})</span></h2>
          {isAdmin && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { setShowMemberForm(!showMemberForm); setShowAssignForm(false); }} className="btn btn-secondary" style={{ fontSize: 12 }}>
                <UserPlus size={14} /> Add Member
              </button>
              <button onClick={() => { setShowAssignForm(!showAssignForm); setShowMemberForm(false); }} className="btn btn-secondary" style={{ fontSize: 12 }}>
                <Plus size={14} /> Assign User
              </button>
            </div>
          )}
        </div>

        {/* Add Member Form */}
        {showMemberForm && (
          <form onSubmit={handleAddMember} style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
            <select value={memberForm.userId} onChange={(e) => setMemberForm({ ...memberForm, userId: e.target.value })} required className="select" style={{ flex: 2, minWidth: 200 }}>
              <option value="">Select user to add</option>
              {users.filter((u) => !project.members?.find((m) => m.user?._id === u._id)).map((u) => (
                <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
              ))}
            </select>
            <select value={memberForm.role} onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })} className="select" style={{ flex: 1 }}>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" className="btn btn-primary">Add</button>
            <button type="button" onClick={() => setShowMemberForm(false)} className="btn btn-secondary">Cancel</button>
          </form>
        )}

        {/* Assign User Form */}
        {showAssignForm && (
          <form onSubmit={handleAssignMember} style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
            <select value={assignForm.userId} onChange={(e) => setAssignForm({ ...assignForm, userId: e.target.value })} required className="select" style={{ flex: 2, minWidth: 200 }}>
              <option value="">Select user to assign</option>
              {users.filter((u) => !project.members?.find((m) => m.user?._id === u._id)).map((u) => (
                <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
              ))}
            </select>
            <select value={assignForm.role} onChange={(e) => setAssignForm({ ...assignForm, role: e.target.value })} className="select" style={{ flex: 1 }}>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" className="btn btn-primary">Assign</button>
            <button type="button" onClick={() => setShowAssignForm(false)} className="btn btn-secondary">Cancel</button>
          </form>
        )}

        <div className="member-list">
          {project.members?.map((member) => (
            <div key={member.user?._id} className="member-pill">
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary-soft)', color: 'var(--primary)', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                {member.user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>{member.user?.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{member.role}</div>
              </div>
              {isAdmin && (
                <button onClick={() => handleRemoveMember(member.user?._id)} className="btn btn-danger icon-btn" title="Remove member" style={{ width: 26, height: 26, marginLeft: 4 }}>
                  <X size={13} />
                </button>
              )}
            </div>
          ))}
          {!project.members?.length && (
            <div style={{ color: 'var(--text-dim)', fontSize: 13 }}>No members yet. Add team members above.</div>
          )}
        </div>
      </div>

      {/* ── Pending Approvals ── */}
      {isAdmin && pendingCount > 0 && (
        <div className="glass-card" style={{ marginBottom: 16, borderLeft: '3px solid var(--warning)' }}>
          <div className="section-title">
            <h2>Pending Approvals <span style={{ color: 'var(--warning)', fontWeight: 400, fontSize: 14 }}>({pendingCount})</span></h2>
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            {project.pendingMembers?.filter(p => p.status === 'pending').map((pending) => (
              <div key={pending.user?._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'var(--warning-soft)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>{pending.user?.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {pending.user?.email} · Requested {new Date(pending.requestedAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => handleApproveMember(pending.user?._id)} className="btn icon-btn" title="Approve" style={{ background: 'var(--success-soft)', color: 'var(--success)', border: '1px solid rgba(16,185,129,0.2)', width: 32, height: 32 }}>
                    <Check size={15} />
                  </button>
                  <button onClick={() => handleRejectMember(pending.user?._id)} className="btn btn-danger icon-btn" title="Reject" style={{ width: 32, height: 32 }}>
                    <X size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Create Task Form ── */}
      {showTaskForm && (
        <div className="glass-card" style={{ marginBottom: 16 }}>
          <div className="section-title"><h2>Create Task</h2></div>
          <form onSubmit={handleCreateTask}>
            <div className="form-grid">
              <input className="field full-span" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} placeholder="Task title *" required />
              <textarea className="textarea full-span" value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} placeholder="Description (optional)" />
              <select className="select" value={taskForm.assignedTo} onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}>
                <option value="">Unassigned</option>
                {project.members?.map((m) => <option key={m.user?._id} value={m.user?._id}>{m.user?.name}</option>)}
              </select>
              <select className="select" value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}>
                {['low', 'medium', 'high'].map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)} Priority</option>)}
              </select>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Due Date</label>
                <input className="field" type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} />
              </div>
              <select className="select" value={taskForm.status} onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}>
                {columns.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button type="submit" className="btn btn-primary">Create Task</button>
              <button type="button" onClick={() => setShowTaskForm(false)} className="btn btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* ── Kanban Board ── */}
      <div style={{ marginBottom: 12 }}>
        <div className="section-title">
          <h2>Tasks <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 14 }}>({tasks.length})</span></h2>
        </div>
      </div>

      <div className="kanban-board">
        {columns.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column);
          return (
            <div key={column} className="kanban-column">
              <div className="kanban-header">
                <span className="dot" style={{ background: statusColor[column] }} />
                <span style={{ flex: 1, textTransform: 'capitalize' }}>{column.replace('-', ' ')}</span>
                <span className="badge" style={{ color: statusColor[column], background: `${statusColor[column]}1a`, marginLeft: 'auto' }}>
                  {columnTasks.length}
                </span>
              </div>

              {!columnTasks.length && (
                <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--text-dim)', fontSize: 12 }}>
                  No tasks
                </div>
              )}

              {columnTasks.map((task) => {
                const canEditTask = isAdmin || task.createdBy?._id === user?._id;
                return (
                  <div key={task._id} className="task-card" style={{ borderLeft: `3px solid ${priorityColor[task.priority]}` }}>
                    <h4>{task.title}</h4>
                    {task.description && (
                      <p className="meta" style={{ marginTop: 4, fontSize: 12, lineHeight: 1.4 }}>{task.description}</p>
                    )}
                    <div className="meta" style={{ display: 'grid', gap: 4, margin: '8px 0' }}>
                      {/* Admin inline reassign dropdown */}
                      {isAdmin ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--primary-soft)', color: 'var(--primary)', display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 700, flexShrink: 0 }}>
                            {task.assignedTo?.name?.[0] || '?'}
                          </div>
                          <select
                            value={task.assignedTo?._id || ''}
                            onChange={(e) => handleReassignTask(task._id, e.target.value)}
                            className="select"
                            title="Reassign task"
                            style={{ fontSize: 11, padding: '3px 6px', flex: 1, color: 'var(--primary)', fontWeight: 600, border: '1px solid var(--primary-soft)', background: 'var(--primary-soft)', borderRadius: 6 }}
                          >
                            <option value="">Unassigned</option>
                            {project.members?.map((m) => (
                              <option key={m.user?._id} value={m.user?._id}>{m.user?.name}</option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        task.assignedTo && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--primary-soft)', color: 'var(--primary)', display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 700 }}>
                              {task.assignedTo.name?.[0]}
                            </div>
                            {task.assignedTo.name}
                          </span>
                        )
                      )}
                      {task.dueDate && (
                        <span style={{ color: task.isOverdue ? 'var(--danger)' : undefined }}>
                          Due {new Date(task.dueDate).toLocaleDateString()}{task.isOverdue ? ' · OVERDUE' : ''}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                        className="select"
                        style={{ fontSize: 11, padding: '5px 8px', color: statusColor[task.status], flex: 1, minWidth: 90 }}
                      >
                        {columns.map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                      <span className="badge" style={{ color: priorityColor[task.priority], background: `${priorityColor[task.priority]}1a`, fontSize: 10 }}>
                        {task.priority}
                      </span>
                      {canEditTask && (
                        <button onClick={() => handleDeleteTask(task._id)} className="btn btn-danger icon-btn" title="Delete" style={{ width: 28, height: 28 }}>
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

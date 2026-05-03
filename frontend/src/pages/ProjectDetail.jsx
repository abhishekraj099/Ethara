import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Trash2, UserPlus, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI, projectAPI, taskAPI } from '../api';
import { useAuth } from '../context/AuthContext';

const statusColor = { todo: '#94A3B8', 'in-progress': '#E879F9', review: '#FBBF24', done: '#6EE7B7' };
const priorityColor = { low: '#94A3B8', medium: '#FBBF24', high: '#FB7185' };
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

  if (!project) return <div className="page"><div className="glass-card">Loading project...</div></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="eyebrow">Project</div>
          <h1 className="page-title">{project.name}</h1>
          <p className="page-subtitle">{project.description || 'No description added.'}</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowTaskForm(!showTaskForm)} className="btn btn-primary">
            <Plus size={18} /> Add Task
          </button>
        )}
      </div>

      <div className="glass-card" style={{ marginBottom: 18 }}>
        <div className="section-title">
          <h2>Team Members ({project.members?.length || 0})</h2>
          {isAdmin && (
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowMemberForm(!showMemberForm)} className="btn btn-secondary">
                <UserPlus size={16} /> Add Member
              </button>
              <button onClick={() => setShowAssignForm(!showAssignForm)} className="btn btn-secondary">
                <Plus size={16} /> Assign User
              </button>
            </div>
          )}
        </div>

        {showMemberForm && (
          <form onSubmit={handleAddMember} className="form-grid" style={{ marginBottom: 14 }}>
            <select value={memberForm.userId} onChange={(e) => setMemberForm({ ...memberForm, userId: e.target.value })} required className="select">
              <option value="">Select user to add</option>
              {users.filter((u) => !project.members?.find((m) => m.user?._id === u._id)).map((u) => (
                <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
              ))}
            </select>
            <select value={memberForm.role} onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })} className="select">
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" className="btn btn-primary">Add</button>
          </form>
        )}

        {showAssignForm && (
          <form onSubmit={handleAssignMember} className="form-grid" style={{ marginBottom: 14 }}>
            <select value={assignForm.userId} onChange={(e) => setAssignForm({ ...assignForm, userId: e.target.value })} required className="select">
              <option value="">Select user to assign</option>
              {users.filter((u) => !project.members?.find((m) => m.user?._id === u._id)).map((u) => (
                <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
              ))}
            </select>
            <select value={assignForm.role} onChange={(e) => setAssignForm({ ...assignForm, role: e.target.value })} className="select">
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" className="btn btn-primary">Assign</button>
          </form>
        )}

        <div className="member-list">
          {project.members?.map((member) => (
            <div key={member.user?._id} className="member-pill" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px' }}>
              <div>
                <strong>{member.user?.name}</strong>
                <span className="meta"> · {member.role}</span>
              </div>
              {isAdmin && (
                <button
                  onClick={() => handleRemoveMember(member.user?._id)}
                  className="btn btn-danger icon-btn"
                  title="Remove member"
                  style={{ marginLeft: 'auto', width: 28, height: 28, padding: 0 }}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {isAdmin && project.pendingMembers?.length > 0 && (
        <div className="glass-card" style={{ marginBottom: 18, borderLeft: '3px solid #FBBF24' }}>
          <div className="section-title">
            <h2>Pending Approvals ({project.pendingMembers?.filter(p => p.status === 'pending').length})</h2>
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {project.pendingMembers?.filter(p => p.status === 'pending').map((pending) => (
              <div key={pending.user?._id} className="member-pill" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
                <div style={{ flex: 1 }}>
                  <strong>{pending.user?.name}</strong>
                  <span className="meta"> · {pending.user?.email}</span>
                  <div className="meta" style={{ fontSize: 11, marginTop: 4, opacity: 0.7 }}>
                    Requested {new Date(pending.requestedAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => handleApproveMember(pending.user?._id)}
                    className="btn icon-btn"
                    title="Approve"
                    style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22C55E', border: 'none', width: 32, height: 32, padding: 0 }}
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => handleRejectMember(pending.user?._id)}
                    className="btn btn-danger icon-btn"
                    title="Reject"
                    style={{ width: 32, height: 32, padding: 0 }}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showTaskForm && (
        <div className="glass-card" style={{ marginBottom: 18 }}>
          <div className="section-title"><h2>Create Task</h2></div>
          <form onSubmit={handleCreateTask}>
            <div className="form-grid">
              <input className="field full-span" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} placeholder="Task title *" required />
              <textarea className="textarea full-span" value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} placeholder="Description" />
              <select className="select" value={taskForm.assignedTo} onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}>
                <option value="">Unassigned</option>
                {project.members?.map((m) => <option key={m.user?._id} value={m.user?._id}>{m.user?.name}</option>)}
              </select>
              <select className="select" value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}>
                {['low', 'medium', 'high'].map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <input className="field" type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} />
              <select className="select" value={taskForm.status} onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}>
                {columns.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button type="submit" className="btn btn-primary">Create Task</button>
              <button type="button" onClick={() => setShowTaskForm(false)} className="btn btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="section-title">
        <h2>Tasks ({tasks.length})</h2>
      </div>

      <div className="kanban-board">
        {columns.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column);
          return (
            <div key={column} className="kanban-column">
              <div className="kanban-header">
                <span className="dot" style={{ background: statusColor[column] }} />
                {column}
                <span className="badge" style={{ marginLeft: 'auto', color: statusColor[column], background: `${statusColor[column]}18` }}>{columnTasks.length}</span>
              </div>

              {!columnTasks.length && <div className="empty-state" style={{ padding: 20 }}>No tasks</div>}

              {columnTasks.map((task) => {
                const canEditTask = isAdmin || task.createdBy?._id === user?._id;
                return (
                  <div key={task._id} className="task-card" style={{ borderLeft: `3px solid ${priorityColor[task.priority]}` }}>
                    <h4>{task.title}</h4>
                    {task.description && <p className="meta" style={{ marginTop: 6 }}>{task.description}</p>}
                    <div className="meta" style={{ display: 'grid', gap: 4, margin: '10px 0' }}>
                      {task.assignedTo && <span>Assigned to {task.assignedTo.name}</span>}
                      <span style={{ fontSize: 11, opacity: 0.7 }}>Created by {task.createdBy?.name}</span>
                      {task.dueDate && <span style={{ color: task.isOverdue ? '#dc2626' : undefined }}>
                        Due {new Date(task.dueDate).toLocaleDateString()} {task.isOverdue ? ' · OVERDUE' : ''}
                      </span>}
                    </div>
                    <div className="row-actions">
                      <select value={task.status} onChange={(e) => handleStatusChange(task._id, e.target.value)} className="select" style={{ fontSize: 12, padding: '7px 9px', color: statusColor[task.status] }}>
                        {columns.map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                      <span className="badge" style={{ color: priorityColor[task.priority], background: `${priorityColor[task.priority]}18` }}>{task.priority}</span>
                      {canEditTask && (
                        <button onClick={() => handleDeleteTask(task._id)} className="btn btn-danger icon-btn" title="Delete task">
                          <Trash2 size={14} />
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

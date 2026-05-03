import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Check, ExternalLink, Plus, ShieldCheck, Trash2, Users, X, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { projectAPI } from '../api';
import { useAuth } from '../context/AuthContext';

const statusMeta = {
  active:    { color: '#16a34a', bg: '#dcfce7', label: 'Active' },
  completed: { color: '#6366f1', bg: '#ede9fe', label: 'Completed' },
  archived:  { color: '#94a3b8', bg: '#f1f5f9', label: 'Archived' },
  pending:   { color: '#d97706', bg: '#fef3c7', label: 'Pending Approval' },
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', deadline: '' });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';

  const load = () => {
    setLoading(true);
    projectAPI.getAll()
      .then((r) => setProjects(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await projectAPI.create(form);
      toast.success(isAdmin ? 'Project created!' : 'Project submitted for admin approval!');
      setForm({ name: '', description: '', deadline: '' });
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project and all its tasks?')) return;
    try {
      await projectAPI.delete(id);
      toast.success('Project deleted');
      load();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleApprove = async (id) => {
    try {
      await projectAPI.approveProject(id);
      toast.success('Project approved!');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve');
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Reason for rejection (optional):') ?? '';
    try {
      await projectAPI.rejectProject(id, reason);
      toast.success('Project rejected');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject');
    }
  };

  const pendingProjects = projects.filter(p => p.status === 'pending');
  const activeProjects  = projects.filter(p => p.status !== 'pending');

  return (
    <div className="page">
      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <div className="eyebrow">{isAdmin ? '👑 Admin View' : '👤 Member View'}</div>
          <h1 className="page-title">
            {isAdmin ? 'All Projects' : 'My Projects'}
          </h1>
          <p className="page-subtitle">
            {isAdmin
              ? 'Manage all projects, approve member submissions, and oversee delivery.'
              : 'Submit a new project for admin approval or view your assigned projects.'}
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} />
          {isAdmin ? 'New Project' : 'Submit Project'}
        </button>
      </div>

      {/* ── Create / Submit Form ── */}
      {showForm && (
        <div className="glass-card" style={{ marginBottom: 20, borderLeft: '3px solid var(--primary)' }}>
          <div className="section-title">
            <h2>{isAdmin ? 'Create New Project' : 'Submit Project for Approval'}</h2>
          </div>
          {!isAdmin && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'var(--warning-soft)', border: '1px solid #fde68a', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#92400e' }}>
              <Clock size={14} style={{ flexShrink: 0 }} />
              Your project will be reviewed by an admin before becoming active.
            </div>
          )}
          <form onSubmit={handleCreate}>
            <div className="form-grid">
              <input className="field full-span" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Project name *" required />
              <textarea className="textarea full-span" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe what this project is about..." />
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Deadline (optional)</label>
                <input className="field" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button type="submit" className="btn btn-primary">
                {isAdmin ? 'Create Project' : '📤 Submit for Approval'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* ── ADMIN: Pending Approvals Queue ── */}
      {isAdmin && pendingProjects.length > 0 && (
        <div className="glass-card" style={{ marginBottom: 24, borderLeft: '3px solid var(--warning)' }}>
          <div className="section-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={18} style={{ color: 'var(--warning)' }} />
              <h2>Pending Project Approvals</h2>
              <span className="badge" style={{ background: 'var(--warning-soft)', color: 'var(--warning)' }}>
                {pendingProjects.length}
              </span>
            </div>
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {pendingProjects.map((project) => (
              <div key={project._id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: 'var(--warning-soft)', border: '1px solid #fde68a', borderRadius: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 2 }}>{project.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    Submitted by <strong>{project.owner?.name}</strong> ({project.owner?.email})
                    {' · '}{new Date(project.createdAt).toLocaleDateString()}
                  </div>
                  {project.description && (
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{project.description}</div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button onClick={() => handleApprove(project._id)} className="btn" style={{ background: 'var(--success-soft)', color: 'var(--success)', border: '1px solid #86efac', fontSize: 12, gap: 5 }}>
                    <Check size={14} /> Approve
                  </button>
                  <button onClick={() => handleReject(project._id)} className="btn btn-danger" style={{ fontSize: 12, gap: 5 }}>
                    <X size={14} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MEMBER: Pending notice banner ── */}
      {!isAdmin && projects.some(p => p.status === 'pending') && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '12px 16px', background: 'var(--warning-soft)', border: '1px solid #fde68a', borderRadius: 10, marginBottom: 20, fontSize: 13, color: '#92400e' }}>
          <Clock size={16} style={{ flexShrink: 0 }} />
          <span>You have <strong>{projects.filter(p => p.status === 'pending').length}</strong> project(s) waiting for admin approval.</span>
        </div>
      )}

      {/* ── Projects Grid ── */}
      {loading ? (
        <div style={{ color: 'var(--text-muted)', padding: 40 }}>Loading projects...</div>
      ) : !projects.length ? (
        <div className="empty-state">
          {isAdmin ? 'No projects in the system yet.' : 'No projects yet. Submit your first one above.'}
        </div>
      ) : (
        <>
          {/* For admin, show section label for active/approved projects */}
          {isAdmin && activeProjects.length > 0 && (
            <div className="section-title" style={{ marginBottom: 14 }}>
              <h2>All Active Projects <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 14 }}>({activeProjects.length})</span></h2>
            </div>
          )}

          {!activeProjects.length && !isAdmin && (
            <div className="empty-state">No active projects. Submit a project for admin approval to get started.</div>
          )}

          <div className="card-grid">
            {activeProjects.map((project) => {
              const sm = statusMeta[project.status] || statusMeta.active;
              const canDelete = isAdmin || project.owner?._id === user?._id;
              const isPending = project.status === 'pending';

              return (
                <div key={project._id} className="project-card" style={{ opacity: isPending ? 0.75 : 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                    <h3>{project.name}</h3>
                    <span className="badge" style={{ color: sm.color, background: sm.bg, flexShrink: 0 }}>
                      {sm.label}
                    </span>
                  </div>

                  <p className="meta" style={{ minHeight: 36, marginBottom: 14 }}>
                    {project.description || 'No description added.'}
                  </p>

                  {/* Admin: show owner info */}
                  {isAdmin && (
                    <div className="meta" style={{ marginBottom: 10, padding: '6px 10px', background: 'var(--surface2)', borderRadius: 6, fontSize: 12 }}>
                      <ShieldCheck size={12} style={{ display: 'inline', marginRight: 4, color: 'var(--primary)' }} />
                      Owner: <strong>{project.owner?.name}</strong> ({project.owner?.email})
                    </div>
                  )}

                  <div className="meta" style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 14 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Users size={12} /> {project.members?.length || 0} member{project.members?.length !== 1 ? 's' : ''}
                    </span>
                    {project.deadline && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <CalendarDays size={12} /> Due {new Date(project.deadline).toLocaleDateString()}
                      </span>
                    )}
                    {isAdmin && project.approvedBy && (
                      <span style={{ color: 'var(--success)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Check size={11} /> Approved by {project.approvedBy?.name}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    {project.status !== 'pending' ? (
                      <Link to={`/projects/${project._id}`} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                        <ExternalLink size={14} /> Open
                      </Link>
                    ) : (
                      <div className="btn" style={{ flex: 1, justifyContent: 'center', background: 'var(--warning-soft)', color: '#92400e', border: '1px solid #fde68a', cursor: 'default' }}>
                        <Clock size={14} /> Awaiting Approval
                      </div>
                    )}
                    {canDelete && (
                      <button onClick={() => handleDelete(project._id)} className="btn btn-danger icon-btn" title="Delete project">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

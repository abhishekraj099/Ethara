import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ExternalLink, Plus, Trash2, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { projectAPI } from '../api';
import { useAuth } from '../context/AuthContext';

const statusColors = { active: '#16a34a', completed: '#059669', archived: '#64748b' };

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', deadline: '' });
  const { user } = useAuth();

  const load = () => projectAPI.getAll().then((r) => setProjects(r.data));

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await projectAPI.create(form);
      toast.success('Project created!');
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

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="eyebrow">Projects</div>
          <h1 className="page-title">Project portfolio</h1>
          <p className="page-subtitle">Create workspaces, manage teams, and keep project delivery easy to scan.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={18} /> New Project
        </button>
      </div>

      {showForm && (
        <div className="glass-card" style={{ marginBottom: 20 }}>
          <div className="section-title"><h2>Create Project</h2></div>
          <form onSubmit={handleCreate}>
            <div className="form-grid">
              <input className="field full-span" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Project name *" required />
              <textarea className="textarea full-span" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" />
              <input className="field" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button type="submit" className="btn btn-primary">Create</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {!projects.length && <div className="empty-state">No projects yet. Create your first one to begin.</div>}

      <div className="card-grid">
        {projects.map((project) => (
          <div key={project._id} className="project-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
              <h3>{project.name}</h3>
              <span className="badge" style={{ color: statusColors[project.status], background: `${statusColors[project.status]}18` }}>
                {project.status}
              </span>
            </div>

            <p className="meta" style={{ minHeight: 40, margin: '10px 0 16px' }}>
              {project.description || 'No description added.'}
            </p>

            <div className="meta" style={{ display: 'grid', gap: 7, marginBottom: 16 }}>
              <span><Users size={13} /> {project.members?.length || 0} members · Owner: {project.owner?.name}</span>
              {project.deadline && <span><CalendarDays size={13} /> Due {new Date(project.deadline).toLocaleDateString()}</span>}
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Link to={`/projects/${project._id}`} className="btn btn-secondary">
                <ExternalLink size={15} /> Open
              </Link>
              {(project.owner?._id === user?._id || user?.role === 'admin') && (
                <button onClick={() => handleDelete(project._id)} className="btn btn-danger">
                  <Trash2 size={15} /> Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

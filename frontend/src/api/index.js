import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  getUsers: () => API.get('/auth/users'),
  getMe: () => API.get('/auth/me'),
};

export const projectAPI = {
  getAll: () => API.get('/projects'),
  getOne: (id) => API.get(`/projects/${id}`),
  create: (data) => API.post('/projects', data),
  update: (id, data) => API.put(`/projects/${id}`, data),
  delete: (id) => API.delete(`/projects/${id}`),
  addMember: (projectId, data) => API.post(`/projects/${projectId}/members`, data),
  removeMember: (projectId, userId) => API.delete(`/projects/${projectId}/members/${userId}`),
};

export const taskAPI = {
  getAll: (params) => API.get('/tasks', { params }),
  getMy: () => API.get('/tasks/my'),
  getDashboard: () => API.get('/tasks/dashboard'),
  getOne: (id) => API.get(`/tasks/${id}`),
  create: (data) => API.post('/tasks', data),
  update: (id, data) => API.put(`/tasks/${id}`, data),
  delete: (id) => API.delete(`/tasks/${id}`),
};

export default API;
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');

const checkProjectAccess = async (projectId, userId, userRole) => {
  const project = await Project.findById(projectId);
  if (!project) return { error: 'Project not found', status: 404 };

  const isOwner = project.owner.toString() === userId.toString();
  const isMember = project.members.some(m => m.user.toString() === userId.toString());

  if (!isOwner && !isMember && userRole !== 'admin') {
    return { error: 'Access denied', status: 403 };
  }

  return { project };
};

router.get('/', protect, async (req, res) => {
  try {
    const { project: projectId, status, priority, assignedTo } = req.query;

    const filter = {};
    if (projectId) {
      const access = await checkProjectAccess(projectId, req.user._id, req.user.role);
      if (access.error) return res.status(access.status).json({ message: access.error });
      filter.project = projectId;
    }
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('project', 'name')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/my', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate('project', 'name')
      .populate('createdBy', 'name email')
      .sort({ dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/dashboard', protect, async (req, res) => {
  try {
    const myTasks = await Task.find({ assignedTo: req.user._id }).populate('project', 'name');

    const total = myTasks.length;
    const done = myTasks.filter(t => t.status === 'done').length;
    const inProgress = myTasks.filter(t => t.status === 'in-progress').length;
    const todo = myTasks.filter(t => t.status === 'todo').length;
    const overdue = myTasks.filter(t => t.isOverdue).length;

    const recentTasks = myTasks.slice(0, 5);

    res.json({ total, done, inProgress, todo, overdue, recentTasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('project').notEmpty().withMessage('Project ID is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { title, description, project, assignedTo, priority, dueDate, tags, status } = req.body;

    const access = await checkProjectAccess(project, req.user._id, req.user.role);
    if (access.error) return res.status(access.status).json({ message: access.error });

    const task = await Task.create({
      title, description, project, assignedTo,
      priority, dueDate, tags, status,
      createdBy: req.user._id
    });

    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');
    await task.populate('project', 'name');

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('project', 'name');

    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const access = await checkProjectAccess(task.project, req.user._id, req.user.role);
    if (access.error) return res.status(access.status).json({ message: access.error });

    const memberEntry = access.project.members.find(
      m => m.user.toString() === req.user._id.toString()
    );
    const isOwner = access.project.owner.toString() === req.user._id.toString();
    const isProjectAdmin = memberEntry && memberEntry.role === 'admin';
    const isTaskCreator = task.createdBy.toString() === req.user._id.toString();
    const isSystemAdmin = req.user.role === 'admin';

    const { title, description, assignedTo, priority, dueDate, tags, status } = req.body;

    // Only project admin, task creator, or system admin can edit full details
    if (isProjectAdmin || isOwner || isSystemAdmin || isTaskCreator) {
      task.title = title || task.title;
      task.description = description !== undefined ? description : task.description;
      task.assignedTo = assignedTo !== undefined ? assignedTo : task.assignedTo;
      task.priority = priority || task.priority;
      task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;
      task.tags = tags || task.tags;
      task.status = status || task.status;
    } else {
      // Regular members can only update status
      task.status = status || task.status;
    }

    await task.save();
    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');
    await task.populate('project', 'name');

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const access = await checkProjectAccess(task.project, req.user._id, req.user.role);
    if (access.error) return res.status(access.status).json({ message: access.error });

    const isOwner = access.project.owner.toString() === req.user._id.toString();
    const memberEntry = access.project.members.find(m => m.user.toString() === req.user._id.toString());
    const isProjectAdmin = memberEntry && memberEntry.role === 'admin';

    if (!isOwner && !isProjectAdmin && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only project admins can delete tasks' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
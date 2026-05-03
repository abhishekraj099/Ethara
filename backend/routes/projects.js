const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const Task = require('../models/Task');
const { protect, projectAdmin } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id }
      ]
    }).populate('owner', 'name email').populate('members.user', 'name email').populate('pendingMembers.user', 'name email');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, [
  body('name').trim().isLength({ min: 2 }).withMessage('Project name too short'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { name, description, deadline } = req.body;
    const project = await Project.create({
      name,
      description,
      deadline,
      owner: req.user._id,
      members: [{ user: req.user._id, role: 'admin' }]
    });
    await project.populate('owner', 'name email');
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email')
      .populate('pendingMembers.user', 'name email');

    if (!project) return res.status(404).json({ message: 'Project not found' });

    const isMember = project.members.some(m => m.user._id.toString() === req.user._id.toString());
    const isOwner = project.owner._id.toString() === req.user._id.toString();

    if (!isMember && !isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:projectId', protect, projectAdmin, async (req, res) => {
  try {
    const { name, description, status, deadline } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.projectId,
      { name, description, status, deadline },
      { new: true, runValidators: true }
    ).populate('owner', 'name email').populate('members.user', 'name email');
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:projectId', protect, projectAdmin, async (req, res) => {
  try {
    await Task.deleteMany({ project: req.params.projectId });
    await Project.findByIdAndDelete(req.params.projectId);
    res.json({ message: 'Project and its tasks deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:projectId/members', protect, projectAdmin, async (req, res) => {
  try {
    const { userId, role } = req.body;
    const project = req.project;

    const alreadyMember = project.members.some(m => m.user.toString() === userId);
    if (alreadyMember) return res.status(400).json({ message: 'User already a member' });

    project.members.push({ user: userId, role: role || 'member' });
    
    // Remove from pending if exists
    project.pendingMembers = project.pendingMembers.filter(
      p => p.user.toString() !== userId
    );
    
    await project.save();
    await project.populate('members.user', 'name email').populate('pendingMembers.user', 'name email');
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Request to join project
router.post('/:projectId/request-join', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const isMember = project.members.some(m => m.user.toString() === req.user._id.toString());
    if (isMember) return res.status(400).json({ message: 'Already a member' });

    const isPending = project.pendingMembers.some(p => p.user.toString() === req.user._id.toString());
    if (isPending) return res.status(400).json({ message: 'Request already pending' });

    project.pendingMembers.push({
      user: req.user._id,
      status: 'pending'
    });
    
    await project.save();
    await project.populate('pendingMembers.user', 'name email');
    res.json({ message: 'Request sent', project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get pending member requests (admin only)
router.get('/:projectId/pending-members', protect, projectAdmin, async (req, res) => {
  try {
    const project = req.project;
    const pending = project.pendingMembers.filter(p => p.status === 'pending');
    await project.populate('pendingMembers.user', 'name email');
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Approve member request (admin only)
router.post('/:projectId/approve-member/:userId', protect, projectAdmin, async (req, res) => {
  try {
    const { projectId, userId } = req.params;
    const project = req.project;

    const pendingIndex = project.pendingMembers.findIndex(
      p => p.user.toString() === userId && p.status === 'pending'
    );

    if (pendingIndex === -1) {
      return res.status(404).json({ message: 'Pending request not found' });
    }

    const alreadyMember = project.members.some(m => m.user.toString() === userId);
    if (alreadyMember) return res.status(400).json({ message: 'User already a member' });

    // Mark as approved
    project.pendingMembers[pendingIndex].status = 'approved';
    project.pendingMembers[pendingIndex].approvedBy = req.user._id;
    project.pendingMembers[pendingIndex].approvedAt = new Date();

    // Add to members
    project.members.push({
      user: userId,
      role: 'member',
      joinedAt: new Date()
    });

    await project.save();
    await project.populate('members.user', 'name email').populate('pendingMembers.user', 'name email');
    res.json({ message: 'Member approved', project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reject member request (admin only)
router.post('/:projectId/reject-member/:userId', protect, projectAdmin, async (req, res) => {
  try {
    const { projectId, userId } = req.params;
    const project = req.project;

    const pendingIndex = project.pendingMembers.findIndex(
      p => p.user.toString() === userId && p.status === 'pending'
    );

    if (pendingIndex === -1) {
      return res.status(404).json({ message: 'Pending request not found' });
    }

    // Mark as rejected
    project.pendingMembers[pendingIndex].status = 'rejected';
    project.pendingMembers[pendingIndex].approvedBy = req.user._id;
    project.pendingMembers[pendingIndex].approvedAt = new Date();

    await project.save();
    await project.populate('pendingMembers.user', 'name email');
    res.json({ message: 'Member request rejected', project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Direct assign member (admin only, bypasses approval)
router.post('/:projectId/assign-member', protect, projectAdmin, async (req, res) => {
  try {
    const { userId, role } = req.body;
    const project = req.project;

    const alreadyMember = project.members.some(m => m.user.toString() === userId);
    if (alreadyMember) return res.status(400).json({ message: 'User already a member' });

    // Add directly as member
    project.members.push({
      user: userId,
      role: role || 'member',
      joinedAt: new Date()
    });

    // Remove from pending if exists
    project.pendingMembers = project.pendingMembers.filter(
      p => p.user.toString() !== userId
    );

    await project.save();
    await project.populate('members.user', 'name email').populate('pendingMembers.user', 'name email');
    res.json({ message: 'Member assigned', project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:projectId/members/:userId', protect, projectAdmin, async (req, res) => {
  try {
    const project = req.project;
    project.members = project.members.filter(
      m => m.user.toString() !== req.params.userId
    );
    await project.save();
    res.json({ message: 'Member removed', project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
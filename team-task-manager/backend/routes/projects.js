const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const Task = require('../models/Task');
const { protect, projectAdmin } = require('../middleware/auth');

// ── GET ALL PROJECTS ──
// Admin sees ALL projects (including pending). Members see only their own.
router.get('/', protect, async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'admin') {
      // Admin sees every project
      projects = await Project.find({})
        .populate('owner', 'name email')
        .populate('members.user', 'name email')
        .populate('pendingMembers.user', 'name email')
        .populate('approvedBy', 'name email')
        .sort({ createdAt: -1 });
    } else {
      // Regular user sees only projects they own or are a member of
      projects = await Project.find({
        $or: [
          { owner: req.user._id },
          { 'members.user': req.user._id }
        ]
      })
        .populate('owner', 'name email')
        .populate('members.user', 'name email')
        .populate('pendingMembers.user', 'name email')
        .sort({ createdAt: -1 });
    }
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── CREATE PROJECT ──
// Admin: auto-approved (active). Regular user: status = 'pending' (needs admin approval)
router.post('/', protect, [
  body('name').trim().isLength({ min: 2 }).withMessage('Project name too short'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { name, description, deadline } = req.body;

    const isAdmin = req.user.role === 'admin';

    const project = await Project.create({
      name,
      description,
      deadline,
      owner: req.user._id,
      status: isAdmin ? 'active' : 'pending',   // non-admins need approval
      members: isAdmin ? [{ user: req.user._id, role: 'admin' }] : [],
      ...(isAdmin && { approvedBy: req.user._id, approvedAt: new Date() }),
    });
    await project.populate('owner', 'name email');
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── ADMIN: APPROVE PROJECT ──
router.post('/:projectId/approve', protect, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only system admins can approve projects' });
  }
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.status !== 'pending') return res.status(400).json({ message: 'Project is not pending approval' });

    project.status = 'active';
    project.approvedBy = req.user._id;
    project.approvedAt = new Date();
    // Add the owner as a member with 'admin' role now that it's approved
    const ownerAlreadyMember = project.members.some(m => m.user.toString() === project.owner.toString());
    if (!ownerAlreadyMember) {
      project.members.push({ user: project.owner, role: 'admin', joinedAt: new Date() });
    }
    await project.save();
    await project.populate('owner', 'name email');
    await project.populate('members.user', 'name email');
    await project.populate('approvedBy', 'name email');
    res.json({ message: 'Project approved!', project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── ADMIN: REJECT PROJECT ──
router.post('/:projectId/reject', protect, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only system admins can reject projects' });
  }
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.status !== 'pending') return res.status(400).json({ message: 'Project is not pending approval' });

    project.status = 'archived';
    project.rejectedReason = req.body.reason || 'Rejected by admin';
    await project.save();
    await project.populate('owner', 'name email');
    res.json({ message: 'Project rejected', project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET ONE PROJECT ──
router.get('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email')
      .populate('pendingMembers.user', 'name email')
      .populate('approvedBy', 'name email');

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

// ── UPDATE PROJECT ──
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

// ── DELETE PROJECT ──
router.delete('/:projectId', protect, projectAdmin, async (req, res) => {
  try {
    await Task.deleteMany({ project: req.params.projectId });
    await Project.findByIdAndDelete(req.params.projectId);
    res.json({ message: 'Project and its tasks deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── ADD MEMBER (admin only) ──
router.post('/:projectId/members', protect, projectAdmin, async (req, res) => {
  try {
    const { userId, role } = req.body;
    const project = req.project;

    const alreadyMember = project.members.some(m => m.user.toString() === userId);
    if (alreadyMember) return res.status(400).json({ message: 'User already a member' });

    project.members.push({ user: userId, role: role || 'member' });
    project.pendingMembers = project.pendingMembers.filter(p => p.user.toString() !== userId);

    await project.save();
    await project.populate('members.user', 'name email').populate('pendingMembers.user', 'name email');
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── REQUEST JOIN ──
router.post('/:projectId/request-join', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const isMember = project.members.some(m => m.user.toString() === req.user._id.toString());
    if (isMember) return res.status(400).json({ message: 'Already a member' });

    const isPending = project.pendingMembers.some(p => p.user.toString() === req.user._id.toString());
    if (isPending) return res.status(400).json({ message: 'Request already pending' });

    project.pendingMembers.push({ user: req.user._id, status: 'pending' });
    await project.save();
    await project.populate('pendingMembers.user', 'name email');
    res.json({ message: 'Request sent', project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PENDING MEMBERS ──
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

// ── APPROVE MEMBER ──
router.post('/:projectId/approve-member/:userId', protect, projectAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const project = req.project;

    const pendingIndex = project.pendingMembers.findIndex(
      p => p.user.toString() === userId && p.status === 'pending'
    );
    if (pendingIndex === -1) return res.status(404).json({ message: 'Pending request not found' });

    const alreadyMember = project.members.some(m => m.user.toString() === userId);
    if (alreadyMember) return res.status(400).json({ message: 'User already a member' });

    project.pendingMembers[pendingIndex].status = 'approved';
    project.pendingMembers[pendingIndex].approvedBy = req.user._id;
    project.pendingMembers[pendingIndex].approvedAt = new Date();
    project.members.push({ user: userId, role: 'member', joinedAt: new Date() });

    await project.save();
    await project.populate('members.user', 'name email').populate('pendingMembers.user', 'name email');
    res.json({ message: 'Member approved', project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── REJECT MEMBER ──
router.post('/:projectId/reject-member/:userId', protect, projectAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const project = req.project;

    const pendingIndex = project.pendingMembers.findIndex(
      p => p.user.toString() === userId && p.status === 'pending'
    );
    if (pendingIndex === -1) return res.status(404).json({ message: 'Pending request not found' });

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

// ── ASSIGN MEMBER (direct, admin bypass) ──
router.post('/:projectId/assign-member', protect, projectAdmin, async (req, res) => {
  try {
    const { userId, role } = req.body;
    const project = req.project;

    const alreadyMember = project.members.some(m => m.user.toString() === userId);
    if (alreadyMember) return res.status(400).json({ message: 'User already a member' });

    project.members.push({ user: userId, role: role || 'member', joinedAt: new Date() });
    project.pendingMembers = project.pendingMembers.filter(p => p.user.toString() !== userId);

    await project.save();
    await project.populate('members.user', 'name email').populate('pendingMembers.user', 'name email');
    res.json({ message: 'Member assigned', project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── REMOVE MEMBER ──
router.delete('/:projectId/members/:userId', protect, projectAdmin, async (req, res) => {
  try {
    const project = req.project;
    project.members = project.members.filter(m => m.user.toString() !== req.params.userId);
    await project.save();
    res.json({ message: 'Member removed', project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
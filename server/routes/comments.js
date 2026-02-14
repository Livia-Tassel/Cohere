const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Comment = require('../models/Comment');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const auth = require('../middleware/auth');
const validate = require('../middleware/validation');
const { createCommentNotification } = require('../services/notificationService');

// @route   POST /api/comments
// @desc    Create a comment
// @access  Private
router.post('/', [
  auth,
  body('body').trim().isLength({ min: 1, max: 500 }).withMessage('Comment must be 1-500 characters'),
  body('targetType').isIn(['Question', 'Answer']).withMessage('Invalid target type'),
  body('targetId').isMongoId().withMessage('Invalid target ID'),
  validate
], async (req, res) => {
  try {
    const { body: commentBody, targetType, targetId } = req.body;

    // Verify target exists
    const Model = targetType === 'Question' ? Question : Answer;
    const target = await Model.findById(targetId);
    if (!target) {
      return res.status(404).json({ message: `${targetType} not found` });
    }

    const comment = new Comment({
      body: commentBody,
      author: req.userId,
      targetType,
      targetId
    });

    await comment.save();
    await comment.populate('author', 'username avatar reputation');

    // Create notification
    createCommentNotification(target, comment, targetType);

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/comments/:targetType/:targetId
// @desc    Get comments for a target (question or answer)
// @access  Public
router.get('/:targetType/:targetId', async (req, res) => {
  try {
    const { targetType, targetId } = req.params;
    const { sort = 'newest', page = 1, limit = 20 } = req.query;

    if (!['Question', 'Answer'].includes(targetType)) {
      return res.status(400).json({ message: 'Invalid target type' });
    }

    let sortOption = {};
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'votes':
        sortOption = { votes: -1, createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const comments = await Comment.find({ targetType, targetId })
      .populate('author', 'username avatar reputation')
      .sort(sortOption)
      .limit(parseInt(limit))
      .skip((page - 1) * limit);

    const total = await Comment.countDocuments({ targetType, targetId });

    res.json({
      comments,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/comments/:id
// @desc    Update a comment
// @access  Private (author only)
router.put('/:id', [
  auth,
  body('body').trim().isLength({ min: 1, max: 500 }).withMessage('Comment must be 1-500 characters'),
  validate
], async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    comment.body = req.body.body;
    comment.updatedAt = Date.now();

    await comment.save();
    await comment.populate('author', 'username avatar reputation');

    res.json(comment);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/comments/:id
// @desc    Delete a comment
// @access  Private (author only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/comments/:id/vote
// @desc    Vote on a comment (upvote only, toggle to remove)
// @access  Private
router.post('/:id/vote', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Simple upvote system for comments (no downvotes)
    // In a real app, you'd track who voted to prevent duplicates
    comment.votes += 1;
    await comment.save();

    res.json({ votes: comment.votes });
  } catch (error) {
    console.error('Error voting on comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

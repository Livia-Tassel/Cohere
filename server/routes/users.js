const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');

// @route   GET /api/users/leaderboard
// @desc    Get top users by reputation
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 50, period = 'all' } = req.query;

    let dateFilter = {};
    if (period === 'week') {
      dateFilter = { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
    } else if (period === 'month') {
      dateFilter = { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
    }

    const users = await User.find(dateFilter)
      .sort({ reputation: -1 })
      .limit(parseInt(limit))
      .select('username avatar reputation createdAt');

    res.json(users);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -email');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's questions
router.get('/:id/questions', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const questions = await Question.find({ author: req.params.id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('author', 'username reputation')
      .lean();

    const count = await Question.countDocuments({ author: req.params.id });

    res.json({
      questions,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's answers
router.get('/:id/answers', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const answers = await Answer.find({ author: req.params.id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('author', 'username reputation')
      .populate('question', 'title')
      .lean();

    const count = await Answer.countDocuments({ author: req.params.id });

    res.json({
      answers,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/users/leaderboard
// @desc    Get top users by reputation
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 50, period = 'all' } = req.query;

    let dateFilter = {};
    if (period === 'week') {
      dateFilter = { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
    } else if (period === 'month') {
      dateFilter = { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
    }

    const users = await User.find(dateFilter)
      .sort({ reputation: -1 })
      .limit(parseInt(limit))
      .select('username avatar reputation createdAt');

    res.json(users);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

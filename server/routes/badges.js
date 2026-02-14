const express = require('express');
const router = express.Router();
const Badge = require('../models/Badge');
const UserBadge = require('../models/UserBadge');

// @route   GET /api/badges
// @desc    Get all badges
// @access  Public
router.get('/', async (req, res) => {
  try {
    const badges = await Badge.find().sort({ tier: 1, name: 1 });
    res.json(badges);
  } catch (error) {
    console.error('Error fetching badges:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/badges/user/:userId
// @desc    Get user's earned badges
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const userBadges = await UserBadge.find({ user: req.params.userId })
      .populate('badge')
      .sort({ earnedAt: -1 });

    res.json(userBadges);
  } catch (error) {
    console.error('Error fetching user badges:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/badges/stats/:userId
// @desc    Get badge statistics for a user
// @access  Public
router.get('/stats/:userId', async (req, res) => {
  try {
    const userBadges = await UserBadge.find({ user: req.params.userId })
      .populate('badge');

    const stats = {
      total: userBadges.length,
      bronze: userBadges.filter(ub => ub.badge.tier === 'bronze').length,
      silver: userBadges.filter(ub => ub.badge.tier === 'silver').length,
      gold: userBadges.filter(ub => ub.badge.tier === 'gold').length
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching badge stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

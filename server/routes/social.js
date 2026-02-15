const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Follow a user
router.post('/follow/:userId', auth, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.userId);
    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.params.userId === req.userId) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const user = await User.findById(req.userId);

    if (user.followedUsers.includes(req.params.userId)) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    user.followedUsers.push(req.params.userId);
    await user.save();

    res.json({ message: 'User followed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Unfollow a user
router.delete('/follow/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    user.followedUsers = user.followedUsers.filter(
      id => id.toString() !== req.params.userId
    );
    await user.save();

    res.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get followed users
router.get('/following', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('followedUsers', 'username avatar reputation');

    res.json(user.followedUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get followers
router.get('/followers', auth, async (req, res) => {
  try {
    const followers = await User.find({
      followedUsers: req.userId
    }).select('username avatar reputation');

    res.json(followers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Check if following a user
router.get('/following/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const isFollowing = user.followedUsers.includes(req.params.userId);

    res.json({ isFollowing });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Follow/unfollow tags
router.post('/tags/follow', auth, async (req, res) => {
  try {
    const { tag } = req.body;
    const user = await User.findById(req.userId);

    if (user.followedTags.includes(tag)) {
      return res.status(400).json({ message: 'Already following this tag' });
    }

    user.followedTags.push(tag);
    await user.save();

    res.json({ message: 'Tag followed successfully', followedTags: user.followedTags });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/tags/follow/:tag', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    user.followedTags = user.followedTags.filter(t => t !== req.params.tag);
    await user.save();

    res.json({ message: 'Tag unfollowed successfully', followedTags: user.followedTags });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get followed tags
router.get('/tags/following', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json(user.followedTags || []);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user interests
router.put('/interests', auth, async (req, res) => {
  try {
    const { interests } = req.body;

    const user = await User.findById(req.userId);
    user.interests = interests;
    await user.save();

    res.json({ message: 'Interests updated successfully', interests: user.interests });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get personalized feed
router.get('/feed', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const user = await User.findById(req.userId);
    const Question = require('../models/Question');

    // Build query based on user's interests and followed tags
    const query = {};

    if (user.followedTags && user.followedTags.length > 0) {
      query.tags = { $in: user.followedTags };
    }

    const questions = await Question.find(query)
      .populate('author', 'username avatar reputation')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Question.countDocuments(query);

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

// Get activity feed (questions from followed users)
router.get('/activity', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const user = await User.findById(req.userId);
    const Question = require('../models/Question');

    if (!user.followedUsers || user.followedUsers.length === 0) {
      return res.json({
        questions: [],
        totalPages: 0,
        currentPage: page,
        total: 0
      });
    }

    const questions = await Question.find({
      author: { $in: user.followedUsers }
    })
      .populate('author', 'username avatar reputation')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Question.countDocuments({
      author: { $in: user.followedUsers }
    });

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

module.exports = router;

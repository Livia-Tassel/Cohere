const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Bookmark = require('../models/Bookmark');
const Question = require('../models/Question');

// @route   POST /api/bookmarks
// @desc    Create a bookmark
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { questionId } = req.body;

    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if already bookmarked
    const existingBookmark = await Bookmark.findOne({
      user: req.userId,
      question: questionId
    });

    if (existingBookmark) {
      return res.status(400).json({ message: 'Question already bookmarked' });
    }

    // Create bookmark
    const bookmark = new Bookmark({
      user: req.userId,
      question: questionId
    });

    await bookmark.save();
    res.status(201).json(bookmark);
  } catch (error) {
    console.error('Error creating bookmark:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookmarks
// @desc    Get user's bookmarks with pagination
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const bookmarks = await Bookmark.find({ user: req.userId })
      .populate({
        path: 'question',
        populate: {
          path: 'author',
          select: 'username avatar reputation'
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Bookmark.countDocuments({ user: req.userId });

    res.json({
      bookmarks,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/bookmarks/:questionId
// @desc    Remove a bookmark
// @access  Private
router.delete('/:questionId', auth, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      user: req.userId,
      question: req.params.questionId
    });

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    res.json({ message: 'Bookmark removed' });
  } catch (error) {
    console.error('Error removing bookmark:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/bookmarks/check
// @desc    Check if questions are bookmarked (bulk check)
// @access  Private
router.post('/check', auth, async (req, res) => {
  try {
    const { questionIds } = req.body;

    if (!Array.isArray(questionIds)) {
      return res.status(400).json({ message: 'questionIds must be an array' });
    }

    const bookmarks = await Bookmark.find({
      user: req.userId,
      question: { $in: questionIds }
    }).select('question');

    const bookmarkedIds = bookmarks.map(b => b.question.toString());
    res.json({ bookmarkedIds });
  } catch (error) {
    console.error('Error checking bookmarks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

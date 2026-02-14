const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const User = require('../models/User');
const auth = require('../middleware/auth');
const validate = require('../middleware/validation');

// @route   GET /api/questions/trending
// @desc    Get trending questions
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    const daysAgo = period === 'day' ? 1 : 7;
    const dateThreshold = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

    const questions = await Question.find({
      createdAt: { $gte: dateThreshold }
    })
      .populate('author', 'username avatar reputation')
      .sort({ views: -1, votes: -1 })
      .limit(20);

    res.json(questions);
  } catch (error) {
    console.error('Error fetching trending questions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all questions with filters
router.get('/', async (req, res) => {
  try {
    const { sort = 'newest', tag, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (tag) {
      query.tags = tag;
    }

    if (search) {
      query.$text = { $search: search };
    }

    let sortOption = {};
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'votes':
        sortOption = { votes: -1 };
        break;
      case 'unanswered':
        query.answerCount = 0;
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const questions = await Question.find(query)
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('author', 'username reputation')
      .lean();

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

// Get question by ID
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'username reputation avatar');

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create question
router.post('/', [
  auth,
  body('title').trim().isLength({ min: 10, max: 200 }).withMessage('Title must be 10-200 characters'),
  body('body').trim().isLength({ min: 20 }).withMessage('Body must be at least 20 characters'),
  body('tags').isArray({ min: 1, max: 5 }).withMessage('Must have 1-5 tags'),
  validate
], async (req, res) => {
  try {
    const { title, body, tags } = req.body;

    const question = new Question({
      title,
      body,
      tags,
      author: req.userId
    });

    await question.save();
    await question.populate('author', 'username reputation');

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update question
router.put('/:id', [
  auth,
  body('title').optional().trim().isLength({ min: 10, max: 200 }),
  body('body').optional().trim().isLength({ min: 20 }),
  body('tags').optional().isArray({ min: 1, max: 5 }),
  validate
], async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, body, tags } = req.body;
    if (title) question.title = title;
    if (body) question.body = body;
    if (tags) question.tags = tags;
    question.updatedAt = Date.now();

    await question.save();
    await question.populate('author', 'username reputation');

    res.json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete question
router.delete('/:id', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Answer.deleteMany({ question: req.params.id });
    await question.deleteOne();

    res.json({ message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Accept answer
router.post('/:id/accept/:answerId', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Only question author can accept answers' });
    }

    const answer = await Answer.findById(req.params.answerId);
    if (!answer || answer.question.toString() !== req.params.id) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    if (question.acceptedAnswer) {
      await Answer.findByIdAndUpdate(question.acceptedAnswer, { isAccepted: false });
    }

    question.acceptedAnswer = req.params.answerId;
    answer.isAccepted = true;

    await question.save();
    await answer.save();

    await User.findByIdAndUpdate(answer.author, { $inc: { reputation: 15 } });

    res.json({ message: 'Answer accepted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/questions/:id/related
// @desc    Get related questions based on tags
// @access  Public
router.get('/:id/related', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const related = await Question.find({
      _id: { $ne: question._id },
      tags: { $in: question.tags }
    })
      .populate('author', 'username avatar reputation')
      .sort({ votes: -1, views: -1 })
      .limit(5);

    res.json(related);
  } catch (error) {
    console.error('Error fetching related questions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

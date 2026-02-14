const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Answer = require('../models/Answer');
const Question = require('../models/Question');
const auth = require('../middleware/auth');
const validate = require('../middleware/validation');
const { checkAndAwardBadges } = require('../services/badgeService');

// Get answers for a question
router.get('/question/:questionId', async (req, res) => {
  try {
    const answers = await Answer.find({ question: req.params.questionId })
      .sort({ isAccepted: -1, votes: -1, createdAt: -1 })
      .populate('author', 'username reputation avatar')
      .lean();

    res.json(answers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create answer
router.post('/', [
  auth,
  body('body').trim().isLength({ min: 10 }).withMessage('Answer must be at least 10 characters'),
  body('questionId').notEmpty().withMessage('Question ID is required'),
  validate
], async (req, res) => {
  try {
    const { body, questionId } = req.body;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const answer = new Answer({
      body,
      question: questionId,
      author: req.userId
    });

    await answer.save();
    await answer.populate('author', 'username reputation avatar');

    await Question.findByIdAndUpdate(questionId, { $inc: { answerCount: 1 } });

    // Check and award badges
    checkAndAwardBadges(req.userId);

    res.status(201).json(answer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update answer
router.put('/:id', [
  auth,
  body('body').trim().isLength({ min: 10 }).withMessage('Answer must be at least 10 characters'),
  validate
], async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    if (answer.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    answer.body = req.body.body;
    answer.updatedAt = Date.now();

    await answer.save();
    await answer.populate('author', 'username reputation avatar');

    res.json(answer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete answer
router.delete('/:id', auth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    if (answer.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Question.findByIdAndUpdate(answer.question, { $inc: { answerCount: -1 } });
    await answer.deleteOne();

    res.json({ message: 'Answer deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

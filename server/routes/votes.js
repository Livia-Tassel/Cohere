const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Vote = require('../models/Vote');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const User = require('../models/User');
const auth = require('../middleware/auth');
const validate = require('../middleware/validation');

// Vote on question or answer
router.post('/', [
  auth,
  body('targetType').isIn(['question', 'answer']).withMessage('Invalid target type'),
  body('targetId').notEmpty().withMessage('Target ID is required'),
  body('value').isIn([1, -1]).withMessage('Vote value must be 1 or -1'),
  validate
], async (req, res) => {
  try {
    const { targetType, targetId, value } = req.body;

    const Model = targetType === 'question' ? Question : Answer;
    const target = await Model.findById(targetId);

    if (!target) {
      return res.status(404).json({ message: `${targetType} not found` });
    }

    if (target.author.toString() === req.userId) {
      return res.status(400).json({ message: 'Cannot vote on your own content' });
    }

    const existingVote = await Vote.findOne({
      user: req.userId,
      targetType,
      targetId
    });

    let voteChange = value;

    if (existingVote) {
      if (existingVote.value === value) {
        await existingVote.deleteOne();
        voteChange = -value;
      } else {
        existingVote.value = value;
        await existingVote.save();
        voteChange = value * 2;
      }
    } else {
      const vote = new Vote({
        user: req.userId,
        targetType,
        targetId,
        value
      });
      await vote.save();
    }

    await Model.findByIdAndUpdate(targetId, { $inc: { votes: voteChange } });

    const reputationChange = voteChange * (value > 0 ? 5 : -2);
    await User.findByIdAndUpdate(target.author, { $inc: { reputation: reputationChange } });

    res.json({ message: 'Vote recorded', voteChange });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's votes for specific targets
router.post('/check', auth, async (req, res) => {
  try {
    const { targets } = req.body;

    const votes = await Vote.find({
      user: req.userId,
      targetId: { $in: targets }
    }).lean();

    const voteMap = {};
    votes.forEach(vote => {
      voteMap[vote.targetId.toString()] = vote.value;
    });

    res.json(voteMap);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

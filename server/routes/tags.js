const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// Get all tags with question counts
router.get('/', async (req, res) => {
  try {
    const tags = await Question.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 50 }
    ]);

    res.json(tags.map(tag => ({ name: tag._id, count: tag.count })));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get related tags (tags that co-occur with this tag)
router.get('/:name/related', async (req, res) => {
  try {
    const relatedTags = await Question.aggregate([
      { $match: { tags: req.params.name } },
      { $unwind: '$tags' },
      { $match: { tags: { $ne: req.params.name } } },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json(relatedTags.map(tag => ({ name: tag._id, count: tag.count })));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get questions by tag
router.get('/:name', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const questions = await Question.find({ tags: req.params.name })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('author', 'username reputation')
      .lean();

    const count = await Question.countDocuments({ tags: req.params.name });

    res.json({
      questions,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
      tag: req.params.name
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

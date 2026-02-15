const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['questions', 'answers', 'social', 'engagement', 'special'],
    required: true
  },
  tier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'],
    default: 'bronze'
  },
  xpReward: {
    type: Number,
    default: 0
  },
  criteria: {
    type: {
      type: String,
      enum: ['count', 'streak', 'threshold', 'special'],
      required: true
    },
    target: Number,
    metric: String // e.g., 'questions_asked', 'answers_given', 'votes_received'
  },
  isSecret: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Achievement', achievementSchema);

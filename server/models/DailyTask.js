const mongoose = require('mongoose');

const dailyTaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  xpReward: {
    type: Number,
    required: true
  },
  taskType: {
    type: String,
    enum: ['ask_question', 'answer_question', 'vote', 'comment', 'login', 'view_questions'],
    required: true
  },
  target: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('DailyTask', dailyTaskSchema);

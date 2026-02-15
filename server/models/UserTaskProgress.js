const mongoose = require('mongoose');

const userTaskProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DailyTask',
    required: true
  },
  progress: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

userTaskProgressSchema.index({ user: 1, task: 1, date: 1 });

module.exports = mongoose.model('UserTaskProgress', userTaskProgressSchema);

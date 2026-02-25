const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 200
  },
  body: {
    type: String,
    required: true,
    minlength: 20
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  views: {
    type: Number,
    default: 0
  },
  votes: {
    type: Number,
    default: 0
  },
  answerCount: {
    type: Number,
    default: 0
  },
  acceptedAnswer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer',
    default: null
  },
  status: {
    type: String,
    enum: ['open', 'answered', 'closed'],
    default: 'open'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

questionSchema.index({ title: 'text', body: 'text' });
questionSchema.index({ tags: 1 });
questionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Question', questionSchema);

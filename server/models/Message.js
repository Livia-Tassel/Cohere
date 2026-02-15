const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000 // Limit message length to save space
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // Auto-delete messages older than 30 days
    expires: 2592000 // 30 days in seconds
  }
});

// Compound index for efficient querying
messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, read: 1 });

// Index for conversation queries (both directions)
messageSchema.index({
  sender: 1,
  recipient: 1
});

// Static method to get conversation between two users
messageSchema.statics.getConversation = async function(userId1, userId2, limit = 50, skip = 0) {
  return this.find({
    $or: [
      { sender: userId1, recipient: userId2 },
      { sender: userId2, recipient: userId1 }
    ]
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .skip(skip)
  .populate('sender', 'username avatar')
  .populate('recipient', 'username avatar');
};

// Static method to clean up old messages (called by cron job)
messageSchema.statics.cleanupOldMessages = async function() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const result = await this.deleteMany({ createdAt: { $lt: thirtyDaysAgo } });
  console.log(`Cleaned up ${result.deletedCount} old messages`);
  return result;
};

// Static method to limit messages per conversation
messageSchema.statics.limitConversationMessages = async function(userId1, userId2, maxMessages = 1000) {
  const messages = await this.find({
    $or: [
      { sender: userId1, recipient: userId2 },
      { sender: userId2, recipient: userId1 }
    ]
  })
  .sort({ createdAt: -1 })
  .skip(maxMessages)
  .select('_id');

  if (messages.length > 0) {
    const idsToDelete = messages.map(m => m._id);
    const result = await this.deleteMany({ _id: { $in: idsToDelete } });
    console.log(`Deleted ${result.deletedCount} excess messages from conversation`);
    return result;
  }

  return { deletedCount: 0 };
};

module.exports = mongoose.model('Message', messageSchema);

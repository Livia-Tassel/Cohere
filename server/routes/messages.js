const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');
const Friendship = require('../models/Friendship');
const { createNotification } = require('../services/notificationService');

// Send a message
router.post('/', auth, async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    const senderId = req.userId;

    // Validate content
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    if (content.length > 1000) {
      return res.status(400).json({ message: 'Message too long (max 1000 characters)' });
    }

    // Check if users are friends
    const friendship = await Friendship.findOne({
      $or: [
        { requester: senderId, recipient: recipientId, status: 'accepted' },
        { requester: recipientId, recipient: senderId, status: 'accepted' }
      ]
    });

    if (!friendship) {
      return res.status(403).json({ message: 'Can only message friends' });
    }

    // Create message
    const message = new Message({
      sender: senderId,
      recipient: recipientId,
      content: content.trim()
    });

    await message.save();

    // Populate sender info
    await message.populate('sender', 'username avatar');
    await message.populate('recipient', 'username avatar');

    // Create notification for recipient
    await createNotification({
      recipient: recipientId,
      type: 'message',
      actor: senderId,
      message: 'sent you a message'
    });

    // Limit conversation messages to 1000
    await Message.limitConversationMessages(senderId, recipientId, 1000);

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get conversation with a friend
router.get('/conversation/:friendId', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { friendId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Check if users are friends
    const friendship = await Friendship.findOne({
      $or: [
        { requester: userId, recipient: friendId, status: 'accepted' },
        { requester: friendId, recipient: userId, status: 'accepted' }
      ]
    });

    if (!friendship) {
      return res.status(403).json({ message: 'Can only view messages with friends' });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const messages = await Message.getConversation(
      userId,
      friendId,
      parseInt(limit),
      skip
    );

    // Count total messages
    const total = await Message.countDocuments({
      $or: [
        { sender: userId, recipient: friendId },
        { sender: friendId, recipient: userId }
      ]
    });

    // Mark messages as read
    await Message.updateMany(
      { sender: friendId, recipient: userId, read: false },
      { read: true }
    );

    res.json({
      messages: messages.reverse(), // Reverse to show oldest first
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error getting conversation:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all conversations (list of friends with last message)
router.get('/conversations', auth, async (req, res) => {
  try {
    const userId = req.userId;

    // Get all accepted friendships
    const friendships = await Friendship.find({
      $or: [
        { requester: userId, status: 'accepted' },
        { recipient: userId, status: 'accepted' }
      ]
    })
      .populate('requester', 'username avatar')
      .populate('recipient', 'username avatar');

    // Get last message for each friend
    const conversations = await Promise.all(
      friendships.map(async (friendship) => {
        const friendId = friendship.requester._id.toString() === userId
          ? friendship.recipient._id
          : friendship.requester._id;

        const friend = friendship.requester._id.toString() === userId
          ? friendship.recipient
          : friendship.requester;

        // Get last message
        const lastMessage = await Message.findOne({
          $or: [
            { sender: userId, recipient: friendId },
            { sender: friendId, recipient: userId }
          ]
        })
          .sort({ createdAt: -1 })
          .populate('sender', 'username');

        // Count unread messages
        const unreadCount = await Message.countDocuments({
          sender: friendId,
          recipient: userId,
          read: false
        });

        return {
          friend,
          lastMessage,
          unreadCount,
          friendshipId: friendship._id
        };
      })
    );

    // Sort by last message time
    conversations.sort((a, b) => {
      const timeA = a.lastMessage ? a.lastMessage.createdAt : 0;
      const timeB = b.lastMessage ? b.lastMessage.createdAt : 0;
      return timeB - timeA;
    });

    res.json(conversations);
  } catch (error) {
    console.error('Error getting conversations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get unread message count
router.get('/unread-count', auth, async (req, res) => {
  try {
    const userId = req.userId;

    const count = await Message.countDocuments({
      recipient: userId,
      read: false
    });

    res.json({ count });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark conversation as read
router.put('/conversation/:friendId/read', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { friendId } = req.params;

    await Message.updateMany(
      { sender: friendId, recipient: userId, read: false },
      { read: true }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a message (only sender can delete)
router.delete('/:messageId', auth, async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.userId;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only sender can delete
    if (message.sender.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }

    await Message.findByIdAndDelete(messageId);

    res.json({ message: 'Message deleted' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete entire conversation (both users' messages)
router.delete('/conversation/:friendId', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { friendId } = req.params;

    const result = await Message.deleteMany({
      $or: [
        { sender: userId, recipient: friendId },
        { sender: friendId, recipient: userId }
      ]
    });

    res.json({
      message: 'Conversation deleted',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin endpoint: Clean up old messages (can be called by cron job)
router.post('/cleanup', auth, async (req, res) => {
  try {
    // This should be protected by admin middleware in production
    const result = await Message.cleanupOldMessages();
    res.json({
      message: 'Cleanup completed',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error cleaning up messages:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

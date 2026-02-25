const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Friendship = require('../models/Friendship');
const User = require('../models/User');
const { createNotification } = require('../services/notificationService');

// Send friend request
router.post('/', auth, async (req, res) => {
  try {
    const { recipientId } = req.body;
    const requesterId = req.userId;

    // Validate recipientId
    if (!recipientId || !mongoose.Types.ObjectId.isValid(recipientId)) {
      return res.status(400).json({ message: 'Invalid recipient ID' });
    }

    // Check if trying to add self
    if (requesterId === recipientId) {
      return res.status(400).json({ message: 'Cannot send friend request to yourself' });
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if friendship already exists (in either direction)
    const existingFriendship = await Friendship.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId }
      ]
    });

    if (existingFriendship) {
      if (existingFriendship.status === 'accepted') {
        return res.status(400).json({ message: 'Already friends' });
      } else if (existingFriendship.status === 'pending') {
        return res.status(400).json({ message: 'Friend request already sent' });
      } else if (existingFriendship.status === 'blocked') {
        return res.status(400).json({ message: 'Cannot send friend request' });
      } else if (existingFriendship.status === 'rejected') {
        // Delete the rejected document so we can create a fresh one below
        await Friendship.findByIdAndDelete(existingFriendship._id);
        // Fall through to new friendship creation
      } else {
        // Unknown status — delete stale document and recreate
        await Friendship.findByIdAndDelete(existingFriendship._id);
      }
    }

    // Create new friendship request
    const friendship = new Friendship({
      requester: requesterId,
      recipient: recipientId,
      status: 'pending'
    });

    await friendship.save();

    // Create notification for recipient (fire-and-forget)
    createNotification({
      recipient: recipientId,
      type: 'friend_request',
      actor: requesterId,
      message: 'sent you a friend request'
    });

    // Populate requester info before sending response
    await friendship.populate('requester', 'username avatar reputation');
    await friendship.populate('recipient', 'username avatar reputation');

    res.status(201).json(friendship);
  } catch (error) {
    // Handle duplicate key error from unique index race condition
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Friend request already exists' });
    }
    console.error('Error sending friend request:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all friends (accepted friendships)
router.get('/friends', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 20 } = req.query;

    const friendships = await Friendship.find({
      $or: [
        { requester: userId, status: 'accepted' },
        { recipient: userId, status: 'accepted' }
      ]
    })
      .populate('requester', 'username avatar reputation createdAt')
      .populate('recipient', 'username avatar reputation createdAt')
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    // Extract friend info (the other user in the friendship)
    const friends = friendships.map(friendship => {
      const friend = friendship.requester._id.toString() === userId
        ? friendship.recipient
        : friendship.requester;

      return {
        ...friend.toObject(),
        friendshipId: friendship._id,
        friendsSince: friendship.updatedAt
      };
    });

    const total = await Friendship.countDocuments({
      $or: [
        { requester: userId, status: 'accepted' },
        { recipient: userId, status: 'accepted' }
      ]
    });

    res.json({
      friends,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error getting friends:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get pending friend requests (received)
router.get('/requests/received', auth, async (req, res) => {
  try {
    const userId = req.userId;

    const requests = await Friendship.find({
      recipient: userId,
      status: 'pending'
    })
      .populate('requester', 'username avatar reputation createdAt')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error('Error getting friend requests:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get pending friend requests (sent)
router.get('/requests/sent', auth, async (req, res) => {
  try {
    const userId = req.userId;

    const requests = await Friendship.find({
      requester: userId,
      status: 'pending'
    })
      .populate('recipient', 'username avatar reputation createdAt')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error('Error getting sent requests:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Accept friend request
router.put('/:friendshipId/accept', auth, async (req, res) => {
  try {
    const { friendshipId } = req.params;
    const userId = req.userId;

    const friendship = await Friendship.findById(friendshipId);

    if (!friendship) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    // Only recipient can accept
    if (friendship.recipient.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to accept this request' });
    }

    if (friendship.status !== 'pending') {
      return res.status(400).json({ message: 'Request is not pending' });
    }

    friendship.status = 'accepted';
    await friendship.save();

    // Create notification for requester (fire-and-forget)
    createNotification({
      recipient: friendship.requester,
      type: 'friend_accepted',
      actor: userId,
      message: 'accepted your friend request'
    });

    await friendship.populate('requester', 'username avatar reputation');
    await friendship.populate('recipient', 'username avatar reputation');

    res.json(friendship);
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reject friend request
router.put('/:friendshipId/reject', auth, async (req, res) => {
  try {
    const { friendshipId } = req.params;
    const userId = req.userId;

    const friendship = await Friendship.findById(friendshipId);

    if (!friendship) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    // Only recipient can reject
    if (friendship.recipient.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to reject this request' });
    }

    if (friendship.status !== 'pending') {
      return res.status(400).json({ message: 'Request is not pending' });
    }

    friendship.status = 'rejected';
    await friendship.save();

    res.json({ message: 'Friend request rejected' });
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove friend / Cancel friend request
router.delete('/:friendshipId', auth, async (req, res) => {
  try {
    const { friendshipId } = req.params;
    const userId = req.userId;

    const friendship = await Friendship.findById(friendshipId);

    if (!friendship) {
      return res.status(404).json({ message: 'Friendship not found' });
    }

    // Only involved users can delete
    if (friendship.requester.toString() !== userId && friendship.recipient.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Friendship.findByIdAndDelete(friendshipId);

    res.json({ message: 'Friendship removed' });
  } catch (error) {
    console.error('Error removing friendship:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Check friendship status with a user
router.get('/status/:userId', auth, async (req, res) => {
  try {
    const currentUserId = req.userId;
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.json({ status: 'none' });
    }

    if (currentUserId === userId) {
      return res.json({ status: 'self' });
    }

    const friendship = await Friendship.findOne({
      $or: [
        { requester: currentUserId, recipient: userId },
        { requester: userId, recipient: currentUserId }
      ]
    });

    if (!friendship) {
      return res.json({ status: 'none' });
    }

    // Determine the perspective
    const isSender = friendship.requester.toString() === currentUserId;

    res.json({
      status: friendship.status,
      friendshipId: friendship._id,
      isSender,
      createdAt: friendship.createdAt
    });
  } catch (error) {
    console.error('Error checking friendship status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get friend count
router.get('/count', auth, async (req, res) => {
  try {
    const userId = req.userId;

    const count = await Friendship.countDocuments({
      $or: [
        { requester: userId, status: 'accepted' },
        { recipient: userId, status: 'accepted' }
      ]
    });

    res.json({ count });
  } catch (error) {
    console.error('Error getting friend count:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

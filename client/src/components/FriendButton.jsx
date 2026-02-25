import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import {
  sendFriendRequest,
  getFriendshipStatus,
  removeFriend,
  acceptFriendRequest,
  rejectFriendRequest
} from '../services/api';
import toast from 'react-hot-toast';

const FriendButton = ({ userId }) => {
  const { user } = useAuth();
  const [status, setStatus] = useState(null);
  const [friendshipId, setFriendshipId] = useState(null);
  const [isSender, setIsSender] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && userId) {
      loadFriendshipStatus();
    }
  }, [user, userId]);

  const loadFriendshipStatus = async () => {
    try {
      const response = await getFriendshipStatus(userId);
      setStatus(response.data.status);
      setFriendshipId(response.data.friendshipId);
      setIsSender(response.data.isSender);
    } catch (error) {
      console.error('Failed to load friendship status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async () => {
    try {
      await sendFriendRequest(userId);
      toast.success('Friend request sent!');
      loadFriendshipStatus();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    }
  };

  const handleAccept = async () => {
    try {
      await acceptFriendRequest(friendshipId);
      toast.success('Friend request accepted!');
      loadFriendshipStatus();
    } catch (error) {
      toast.error('Failed to accept request');
    }
  };

  const handleReject = async () => {
    try {
      await rejectFriendRequest(friendshipId);
      toast.success('Friend request rejected');
      loadFriendshipStatus();
    } catch (error) {
      toast.error('Failed to reject request');
    }
  };

  const handleRemove = async () => {
    if (!window.confirm('Remove this friend?')) return;

    try {
      await removeFriend(friendshipId);
      toast.success('Friend removed');
      loadFriendshipStatus();
    } catch (error) {
      toast.error('Failed to remove friend');
    }
  };

  const handleCancel = async () => {
    try {
      await removeFriend(friendshipId);
      toast.success('Friend request cancelled');
      loadFriendshipStatus();
    } catch (error) {
      toast.error('Failed to cancel request');
    }
  };

  if (loading) {
    return (
      <div className="w-32 h-10 bg-[var(--bg-tertiary)] rounded-lg animate-pulse"></div>
    );
  }

  // Don't show button for own profile
  if (status === 'self') {
    return null;
  }

  // No friendship or previously rejected - show add friend button
  if (status === 'none' || status === 'rejected') {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSendRequest}
        className="px-4 py-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white rounded-lg font-medium flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
        Add Friend
      </motion.button>
    );
  }

  // Pending - sent by current user
  if (status === 'pending' && isSender) {
    return (
      <div className="flex gap-2">
        <span className="px-4 py-2 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-lg font-medium flex items-center gap-2">
          ⏳ Request Sent
        </span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCancel}
          className="px-4 py-2 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--color-error)] rounded-lg font-medium"
        >
          Cancel
        </motion.button>
      </div>
    );
  }

  // Pending - received by current user
  if (status === 'pending' && !isSender) {
    return (
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAccept}
          className="px-4 py-2 bg-[var(--color-success)] text-white rounded-lg font-medium flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Accept
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReject}
          className="px-4 py-2 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--color-error)] rounded-lg font-medium flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Reject
        </motion.button>
      </div>
    );
  }

  // Accepted - friends
  if (status === 'accepted') {
    return (
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = `/messages/${userId}`}
          className="px-4 py-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white rounded-lg font-medium flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Message
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRemove}
          className="px-4 py-2 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--color-error)] rounded-lg font-medium"
        >
          Remove Friend
        </motion.button>
      </div>
    );
  }

  return null;
};

export default FriendButton;

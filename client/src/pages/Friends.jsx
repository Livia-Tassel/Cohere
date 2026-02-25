import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getFriends,
  getReceivedFriendRequests,
  getSentFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend
} from '../services/api';
import toast from 'react-hot-toast';

const Friends = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'friends') {
        const response = await getFriends({ page: 1, limit: 20 });
        setFriends(response.data.friends);
        setPagination(response.data.pagination);
      } else if (activeTab === 'received') {
        const response = await getReceivedFriendRequests();
        setReceivedRequests(response.data);
      } else if (activeTab === 'sent') {
        const response = await getSentFriendRequests();
        setSentRequests(response.data);
      }
    } catch (error) {
      console.error('Error loading friends data:', error);
      toast.error('Failed to load friends');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (friendshipId) => {
    try {
      await acceptFriendRequest(friendshipId);
      toast.success('Friend request accepted!');
      loadData();
    } catch (error) {
      toast.error('Failed to accept request');
    }
  };

  const handleReject = async (friendshipId) => {
    try {
      await rejectFriendRequest(friendshipId);
      toast.success('Friend request rejected');
      loadData();
    } catch (error) {
      toast.error('Failed to reject request');
    }
  };

  const handleRemove = async (friendshipId, username) => {
    if (!window.confirm(`Remove ${username} from your friends?`)) return;

    try {
      await removeFriend(friendshipId);
      toast.success('Friend removed');
      loadData();
    } catch (error) {
      toast.error('Failed to remove friend');
    }
  };

  const handleCancelRequest = async (friendshipId) => {
    if (!window.confirm('Cancel this friend request?')) return;

    try {
      await removeFriend(friendshipId);
      toast.success('Request cancelled');
      loadData();
    } catch (error) {
      toast.error('Failed to cancel request');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to view friends</h2>
          <Link to="/login" className="btn-primary">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-8">

      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Friends</h1>
          <p className="text-[var(--text-secondary)]">
            Manage your friends and friend requests
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex gap-2 border-b border-[var(--border-primary)]">
            <button
              onClick={() => setActiveTab('friends')}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === 'friends'
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Friends
              {activeTab === 'friends' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('received')}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === 'received'
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Requests
              {receivedRequests.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-[var(--color-primary)] text-white text-xs rounded-full">
                  {receivedRequests.length}
                </span>
              )}
              {activeTab === 'received' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === 'sent'
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Sent
              {activeTab === 'sent' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"
                />
              )}
            </button>
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            {/* Friends List */}
            {activeTab === 'friends' && (
              <div className="space-y-4">
                {friends.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="card text-center py-12"
                  >
                    <div className="text-6xl mb-4">👥</div>
                    <h3 className="text-xl font-bold mb-2">No friends yet</h3>
                    <p className="text-[var(--text-secondary)]">
                      Start connecting with other users!
                    </p>
                  </motion.div>
                ) : (
                  friends.map((friend, index) => (
                    <motion.div
                      key={friend._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="card"
                    >
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/profile/${friend._id}`}
                          className="flex items-center gap-4 flex-1 hover:opacity-80 transition-opacity"
                        >
                          {friend.avatar ? (
                            <img
                              src={friend.avatar}
                              alt={friend.username}
                              className="w-16 h-16 rounded-full border-2 border-[var(--color-primary)]"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-bold text-xl">
                              {friend.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-[var(--text-primary)]">
                              {friend.username}
                            </h3>
                            <p className="text-sm text-[var(--text-secondary)]">
                              {friend.reputation} reputation
                            </p>
                            <p className="text-xs text-[var(--text-tertiary)] mt-1">
                              Friends since {formatDate(friend.friendsSince)}
                            </p>
                          </div>
                        </Link>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRemove(friend.friendshipId, friend.username)}
                          className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-red-600 transition-colors"
                        >
                          Remove
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {/* Received Requests */}
            {activeTab === 'received' && (
              <div className="space-y-4">
                {receivedRequests.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="card text-center py-12"
                  >
                    <div className="text-6xl mb-4">📬</div>
                    <h3 className="text-xl font-bold mb-2">No pending requests</h3>
                    <p className="text-[var(--text-secondary)]">
                      You don't have any friend requests at the moment
                    </p>
                  </motion.div>
                ) : (
                  receivedRequests.map((request, index) => (
                    <motion.div
                      key={request._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="card"
                    >
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/profile/${request.requester._id}`}
                          className="flex items-center gap-4 flex-1 hover:opacity-80 transition-opacity"
                        >
                          {request.requester.avatar ? (
                            <img
                              src={request.requester.avatar}
                              alt={request.requester.username}
                              className="w-16 h-16 rounded-full border-2 border-[var(--color-primary)]"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-bold text-xl">
                              {request.requester.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-[var(--text-primary)]">
                              {request.requester.username}
                            </h3>
                            <p className="text-sm text-[var(--text-secondary)]">
                              {request.requester.reputation} reputation
                            </p>
                            <p className="text-xs text-[var(--text-tertiary)] mt-1">
                              Sent {formatDate(request.createdAt)}
                            </p>
                          </div>
                        </Link>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAccept(request._id)}
                            className="px-4 py-2 bg-[var(--color-success)] text-white rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
                          >
                            Accept
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleReject(request._id)}
                            className="px-4 py-2 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-lg font-medium text-sm hover:bg-[var(--bg-elevated)] border border-[var(--border-primary)] transition-colors"
                          >
                            Reject
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {/* Sent Requests */}
            {activeTab === 'sent' && (
              <div className="space-y-4">
                {sentRequests.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="card text-center py-12"
                  >
                    <div className="text-6xl mb-4">📤</div>
                    <h3 className="text-xl font-bold mb-2">No sent requests</h3>
                    <p className="text-[var(--text-secondary)]">
                      You haven't sent any friend requests
                    </p>
                  </motion.div>
                ) : (
                  sentRequests.map((request, index) => (
                    <motion.div
                      key={request._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="card"
                    >
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/profile/${request.recipient._id}`}
                          className="flex items-center gap-4 flex-1 hover:opacity-80 transition-opacity"
                        >
                          {request.recipient.avatar ? (
                            <img
                              src={request.recipient.avatar}
                              alt={request.recipient.username}
                              className="w-16 h-16 rounded-full border-2 border-[var(--color-primary)]"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-bold text-xl">
                              {request.recipient.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-[var(--text-primary)]">
                              {request.recipient.username}
                            </h3>
                            <p className="text-sm text-[var(--text-secondary)]">
                              {request.recipient.reputation} reputation
                            </p>
                            <p className="text-xs text-[var(--text-tertiary)] mt-1">
                              Sent {formatDate(request.createdAt)}
                            </p>
                          </div>
                        </Link>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCancelRequest(request._id)}
                          className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-red-600 transition-colors"
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Friends;

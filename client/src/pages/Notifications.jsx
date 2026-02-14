import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getNotifications, markNotificationRead, deleteNotification, deleteReadNotifications } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    fetchNotifications();
  }, [user, filter]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const params = filter === 'unread' ? { unreadOnly: true, limit: 100 } : { limit: 100 };
      const response = await getNotifications(params);
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(notifications.map(n =>
        n._id === id ? { ...n, read: true } : n
      ));
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications(notifications.filter(n => n._id !== id));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const handleDeleteRead = async () => {
    if (!window.confirm('Delete all read notifications?')) return;

    try {
      await deleteReadNotifications();
      setNotifications(notifications.filter(n => !n.read));
      toast.success('Read notifications deleted');
    } catch (error) {
      toast.error('Failed to delete notifications');
    }
  };

  const getNotificationLink = (notification) => {
    switch (notification.targetType) {
      case 'Question':
        return `/questions/${notification.targetId}`;
      case 'Answer':
        return `/questions/${notification.targetId}`;
      default:
        return '/';
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🔔</span>
            <h1 className="text-4xl font-bold text-gradient">
              Notifications
            </h1>
          </div>
          <p className="text-[var(--text-secondary)] text-lg">
            Stay updated with your activity
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex gap-3">
            {['all', 'unread'].map((f) => (
              <motion.button
                key={f}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(f)}
                className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                  filter === f
                    ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white shadow-lg'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-primary)]'
                }`}
              >
                {f === 'all' ? 'All' : 'Unread'}
              </motion.button>
            ))}
          </div>

          {notifications.some(n => n.read) && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDeleteRead}
              className="text-sm text-red-600 hover:underline font-semibold"
            >
              Delete Read
            </motion.button>
          )}
        </motion.div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card text-center py-16"
          >
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="text-2xl font-bold mb-2">No notifications</h3>
            <p className="text-[var(--text-secondary)]">
              {filter === 'unread' ? 'All caught up!' : 'You have no notifications yet'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`card ${!notification.read ? 'border-l-4 border-[var(--color-primary)]' : ''}`}
              >
                <div className="flex gap-4">
                  {/* Actor Avatar */}
                  {notification.actor && (
                    <Link to={`/profile/${notification.actor._id}`} className="flex-shrink-0">
                      {notification.actor.avatar ? (
                        <img
                          src={notification.actor.avatar}
                          alt={notification.actor.username}
                          className="w-12 h-12 rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-bold">
                          {notification.actor.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </Link>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <Link to={getNotificationLink(notification)}>
                      <p className="text-[var(--text-primary)] mb-1">
                        {notification.actor && (
                          <span className="font-semibold">
                            {notification.actor.username}{' '}
                          </span>
                        )}
                        {notification.message}
                      </p>
                    </Link>
                    <p className="text-sm text-[var(--text-tertiary)]">
                      {formatTime(notification.createdAt)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex items-start gap-2">
                    {!notification.read && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleMarkRead(notification._id)}
                        className="p-2 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                        title="Mark as read"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(notification._id)}
                      className="p-2 rounded-lg bg-[var(--bg-tertiary)] hover:bg-red-500 hover:text-white transition-colors"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;

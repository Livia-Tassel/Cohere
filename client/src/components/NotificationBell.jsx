import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getNotifications, getUnreadCount, markNotificationRead, markAllNotificationsRead } from '../services/api';
import { useAuth } from '../context/AuthContext';

const NotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    if (isOpen && user) {
      fetchNotifications();
    }
  }, [isOpen, user]);

  const fetchUnreadCount = async () => {
    try {
      const response = await getUnreadCount();
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await getNotifications({ limit: 10 });
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (notificationId) => {
    try {
      await markNotificationRead(notificationId);
      setNotifications(notifications.map(n =>
        n._id === notificationId ? { ...n, read: true } : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
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
    const now = new Date();
    const notifDate = new Date(date);
    const diffInSeconds = Math.floor((now - notifDate) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return notifDate.toLocaleDateString();
  };

  if (!user) return null;

  return (
    <div className="relative">
      {/* Bell Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full bg-[var(--bg-tertiary)] hover:bg-[var(--bg-elevated)] transition-all duration-[var(--transition-fast)] shadow-[var(--shadow-1)] hover:shadow-[var(--shadow-2)]"
        aria-label="Notifications"
      >
        <svg
          className="w-6 h-6 text-[var(--text-primary)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-[var(--shadow-2)]"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 mt-[var(--space-1)] w-96 bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-[var(--radius-xl)] shadow-[var(--shadow-5)] z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-[var(--space-3)] border-b border-[var(--border-primary)]">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-sm text-[var(--color-primary)] hover:underline font-semibold transition-all duration-[var(--transition-fast)]"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="spinner w-6 h-6"></div>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-8 text-[var(--text-tertiary)]">
                    <p className="text-3xl mb-[var(--space-1)]">🔔</p>
                    <p className="text-sm">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <Link
                      key={notification._id}
                      to={getNotificationLink(notification)}
                      onClick={() => {
                        if (!notification.read) {
                          handleMarkRead(notification._id);
                        }
                        setIsOpen(false);
                      }}
                    >
                      <motion.div
                        whileHover={{ backgroundColor: 'var(--bg-tertiary)' }}
                        className={`p-[var(--space-3)] border-b border-[var(--border-primary)] cursor-pointer transition-all duration-[var(--transition-fast)] ${
                          !notification.read ? 'bg-[var(--color-primary)]/5' : ''
                        }`}
                      >
                        <div className="flex gap-[var(--space-2)]">
                          {/* Actor Avatar */}
                          {notification.actor && (
                            <div className="flex-shrink-0">
                              {notification.actor.avatar ? (
                                <img
                                  src={notification.actor.avatar}
                                  alt={notification.actor.username}
                                  className="w-10 h-10 rounded-full"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-bold text-sm">
                                  {notification.actor.username.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-[var(--text-primary)]">
                              {notification.actor && (
                                <span className="font-semibold">
                                  {notification.actor.username}{' '}
                                </span>
                              )}
                              {notification.message}
                            </p>
                            <p className="text-xs text-[var(--text-tertiary)] mt-1">
                              {formatTime(notification.createdAt)}
                            </p>
                          </div>

                          {/* Unread Indicator */}
                          {!notification.read && (
                            <div className="flex-shrink-0">
                              <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </Link>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-[var(--border-primary)] text-center">
                  <Link
                    to="/notifications"
                    onClick={() => setIsOpen(false)}
                    className="text-sm text-[var(--color-primary)] hover:underline font-semibold"
                  >
                    View all notifications
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;

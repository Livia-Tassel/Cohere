import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotificationCenter = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'answer',
      title: 'New answer to your question',
      message: 'John Doe answered your question about React hooks',
      time: '5 minutes ago',
      read: false,
      link: '/questions/123',
      icon: '💬'
    },
    {
      id: 2,
      type: 'vote',
      title: 'Your answer was upvoted',
      message: 'Your answer received 5 upvotes',
      time: '1 hour ago',
      read: false,
      link: '/questions/456',
      icon: '👍'
    },
    {
      id: 3,
      type: 'badge',
      title: 'New badge earned!',
      message: 'You earned the "Helpful" badge',
      time: '2 hours ago',
      read: true,
      link: '/profile/badges',
      icon: '🏆'
    },
    {
      id: 4,
      type: 'mention',
      title: 'You were mentioned',
      message: 'Alice mentioned you in a comment',
      time: '3 hours ago',
      read: true,
      link: '/questions/789',
      icon: '@'
    }
  ]);

  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Notification Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-96 bg-[var(--bg-elevated)] shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-[var(--border-primary)]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-[var(--color-primary)] text-white text-xs rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filter === 'all'
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filter === 'unread'
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
                  }`}
                >
                  Unread
                </button>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="ml-auto text-xs font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-light)] transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="text-6xl mb-4">🔔</div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                    No notifications
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    You're all caught up!
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--border-primary)]">
                  {filteredNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={`p-4 hover:bg-[var(--bg-tertiary)] transition-all ${
                        !notification.read ? 'bg-[var(--color-primary)]/5' : ''
                      }`}
                    >
                      <Link
                        to={notification.link}
                        onClick={() => {
                          markAsRead(notification.id);
                          onClose();
                        }}
                        className="block"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white text-lg">
                            {notification.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="font-semibold text-sm text-[var(--text-primary)]">
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <span className="flex-shrink-0 w-2 h-2 bg-[var(--color-primary)] rounded-full"></span>
                              )}
                            </div>
                            <p className="text-xs text-[var(--text-secondary)] mb-2 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-[var(--text-tertiary)]">
                                {notification.time}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="text-xs text-[var(--text-secondary)] hover:text-red-600 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[var(--border-primary)]">
              <Link
                to="/notifications"
                onClick={onClose}
                className="block text-center text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-light)] transition-colors"
              >
                View All Notifications →
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const NotificationBadge = ({ count, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      {count > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
        >
          {count > 9 ? '9+' : count}
        </motion.span>
      )}
    </button>
  );
};

export { NotificationCenter, NotificationBadge };

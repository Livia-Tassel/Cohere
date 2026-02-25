import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MobileMenu = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logoutUser } = useAuth();

  const menuItems = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/tags', icon: '🏷️', label: 'Tags' },
    { path: '/leaderboard', icon: '🏆', label: 'Leaderboard' },
    ...(user ? [
      { path: '/for-you', icon: '🎯', label: 'For You' },
      { path: '/friends', icon: '👥', label: 'Friends' },
      { path: '/bookmarks', icon: '🔖', label: 'Bookmarks' },
      { path: '/progress', icon: '🎮', label: 'Progress' },
      { path: `/profile/${user._id}`, icon: '👤', label: 'Profile' },
    ] : []),
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
          />

          {/* Menu */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-80 bg-[var(--bg-elevated)] shadow-2xl z-50 overflow-y-auto lg:hidden"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <Link to="/" className="flex items-center gap-2" onClick={onClose}>
                  <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-lg flex items-center justify-center">
                    <span className="text-xl font-bold text-white">C</span>
                  </div>
                  <span className="text-xl font-bold text-gradient">Cohere</span>
                </Link>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* User Info */}
              {user && (
                <div className="mb-6 p-4 rounded-lg bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 border border-[var(--color-primary)]/30">
                  <div className="flex items-center gap-3 mb-3">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.username} className="w-12 h-12 rounded-full border-2 border-[var(--color-primary)]" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-[var(--text-primary)]">{user.username}</div>
                      <div className="text-xs text-[var(--text-secondary)]">{user.reputation} reputation</div>
                    </div>
                  </div>
                  <Link
                    to="/ask"
                    onClick={onClose}
                    className="block w-full btn-primary text-center text-sm py-2"
                  >
                    Ask Question
                  </Link>
                </div>
              )}

              {/* Menu Items */}
              <nav className="space-y-1">
                {menuItems.map((item, index) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive(item.path)
                          ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white shadow-lg'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </motion.div>
                  </Link>
                ))}
              </nav>

              {/* Auth Actions */}
              <div className="mt-6 pt-6 border-t border-[var(--border-primary)]">
                {user ? (
                  <button
                    onClick={() => {
                      logoutUser();
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--text-secondary)] hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="font-medium">Logout</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login" onClick={onClose}>
                      <button className="w-full btn-secondary text-center py-2">
                        Login
                      </button>
                    </Link>
                    <Link to="/register" onClick={onClose}>
                      <button className="w-full btn-primary text-center py-2">
                        Sign Up
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;

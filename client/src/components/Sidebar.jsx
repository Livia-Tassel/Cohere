import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onToggle, isMobile }) => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { path: '/', icon: '🏠', label: 'Home' },
    ...(user ? [
      { path: '/for-you', icon: '🎯', label: 'For You' },
    ] : []),
    { path: '/tags', icon: '🏷️', label: 'Tags' },
    { path: '/leaderboard', icon: '🏆', label: 'Leaderboard' },
    ...(user ? [
      { path: '/progress', icon: '🎮', label: 'Progress' },
      { path: '/friends', icon: '👥', label: 'Friends' },
      { path: '/bookmarks', icon: '🔖', label: 'Bookmarks' },
      { path: '/ask', icon: '✍️', label: 'Ask Question' },
      { path: `/profile/${user.id}`, icon: '👤', label: 'Profile' },
    ] : []),
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: -280 },
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--border-primary)]">
        <h2 className="text-sm font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
          Navigation
        </h2>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => isMobile && onToggle()}
          >
            <motion.div
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center space-x-3 px-[var(--space-3)] py-[var(--space-2)] rounded-[var(--radius-lg)] transition-all ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white shadow-[var(--shadow-2)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <AnimatePresence>
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="font-medium text-sm whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>
        ))}
      </nav>

      {/* User Info */}
      {user && isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border-t border-[var(--border-primary)]"
        >
          <div className="p-[var(--space-3)] rounded-[var(--radius-lg)] bg-[var(--bg-tertiary)] border border-[var(--border-primary)]">
            <div className="flex items-center gap-3">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-10 h-10 rounded-full border-2 border-[var(--color-primary)]"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-bold text-sm">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-[var(--text-primary)] truncate">
                  {user.username}
                </div>
                <div className="text-xs text-[var(--text-tertiary)]">
                  {user.reputation} reputation
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Toggle Button */}
      <div className="p-3 border-t border-[var(--border-primary)]">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onToggle}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-elevated)] border border-[var(--border-primary)] hover:border-[var(--color-primary)] transition-all text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          <span className="text-lg">{isOpen ? '◀' : '▶'}</span>
          {isOpen && <span className="font-medium text-sm">Collapse</span>}
        </motion.button>
      </div>
    </div>
  );

  // Mobile: Overlay drawer
  if (isMobile) {
    return (
      <>
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onToggle}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              />
              <motion.aside
                variants={sidebarVariants}
                initial="closed"
                animate="open"
                exit="closed"
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 h-full w-64 bg-[var(--bg-elevated)] border-r border-[var(--border-primary)] shadow-2xl z-50"
              >
                <SidebarContent />
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop: Fixed sidebar
  return (
    <motion.aside
      animate={{ width: isOpen ? '16rem' : '4rem' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed left-0 top-20 h-[calc(100vh-5rem)] bg-[var(--bg-elevated)] border-r border-[var(--border-primary)] shadow-sm z-40 overflow-hidden"
    >
      <SidebarContent />
    </motion.aside>
  );
};

export default Sidebar;

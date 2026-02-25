import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logoutUser } = useAuth();

  return (
    <nav className="sticky top-0 z-navbar bg-[var(--bg-secondary)]/95 backdrop-blur-md border-b border-[var(--border-primary)] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-[var(--space-2)] group">
            <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-[var(--radius-lg)] flex items-center justify-center shadow-[var(--shadow-2)]">
              <span className="text-lg font-bold text-white">C</span>
            </div>
            <span className="text-lg font-bold text-gradient hidden sm:block">
              Cohere
            </span>
          </Link>

          <div className="flex items-center gap-[var(--space-3)]">
            <Link
              to="/"
              className="text-sm text-[var(--text-primary)] hover:text-[var(--color-primary)] transition-colors duration-[var(--transition-fast)] font-medium hidden sm:block"
            >
              Questions
            </Link>
            <Link
              to="/tags"
              className="text-sm text-[var(--text-primary)] hover:text-[var(--color-primary)] transition-colors duration-[var(--transition-fast)] font-medium hidden sm:block"
            >
              Tags
            </Link>

            <ThemeToggle />

            {user ? (
              <div className="flex items-center gap-[var(--space-2)]">
                <NotificationBell />

                <Link to="/ask">
                  <button className="btn-primary text-sm px-4 py-2">
                    Ask Question
                  </button>
                </Link>

                <Link to={`/profile/${user._id}`} className="flex items-center gap-[var(--space-2)] hover:opacity-80 transition-opacity duration-[var(--transition-fast)]">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full border-2 border-[var(--color-primary)] transition-all duration-[var(--transition-fast)] hover:shadow-[0_0_0_3px_var(--glow-primary)]" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white text-xs font-bold shadow-[var(--shadow-2)]">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="hidden md:block">
                    <div className="font-medium text-xs text-[var(--text-primary)]">{user.username}</div>
                    <div className="text-[10px] text-[var(--text-secondary)]">{user.reputation} rep</div>
                  </div>
                </Link>

                <button
                  onClick={logoutUser}
                  className="text-sm text-[var(--text-primary)] hover:text-red-600 transition-colors duration-[var(--transition-fast)] font-medium hidden sm:block"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-[var(--space-2)]">
                <Link to="/login">
                  <button className="text-sm text-[var(--text-primary)] hover:text-[var(--color-primary)] transition-colors duration-[var(--transition-fast)] font-medium">
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button className="btn-primary text-sm px-4 py-2">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

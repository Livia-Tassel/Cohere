import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logoutUser } = useAuth();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-gray-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-xl flex items-center justify-center shadow-lg"
            >
              <span className="text-2xl font-bold text-white">C</span>
            </motion.div>
            <span className="text-2xl font-bold text-gradient hidden sm:block">
              Cohere
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-[var(--color-dark)] hover:text-[var(--color-primary)] transition-colors font-semibold hidden sm:block"
            >
              Questions
            </Link>
            <Link
              to="/tags"
              className="text-[var(--color-dark)] hover:text-[var(--color-primary)] transition-colors font-semibold hidden sm:block"
            >
              Tags
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/ask">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary"
                  >
                    Ask Question
                  </motion.button>
                </Link>

                <Link to={`/profile/${user.id}`} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full border-2 border-[var(--color-primary)] shadow-sm" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-bold shadow-sm">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="hidden md:block">
                    <div className="font-semibold text-sm">{user.username}</div>
                    <div className="text-xs text-gray-600">{user.reputation} rep</div>
                  </div>
                </Link>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={logoutUser}
                  className="text-[var(--color-dark)] hover:text-red-600 transition-colors font-semibold hidden sm:block"
                >
                  Logout
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-[var(--color-dark)] hover:text-[var(--color-primary)] transition-colors font-semibold"
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary"
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

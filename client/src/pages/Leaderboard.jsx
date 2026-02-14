import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getLeaderboard } from '../services/api';
import toast from 'react-hot-toast';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('all');

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await getLeaderboard({ period, limit: 50 });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      toast.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getRankEmoji = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🏆</span>
            <h1 className="text-4xl font-bold text-gradient">
              Leaderboard
            </h1>
          </div>
          <p className="text-[var(--text-secondary)] text-lg">
            Top contributors ranked by reputation
          </p>
        </motion.div>

        {/* Period Filter */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-3 mb-6"
        >
          {['all', 'month', 'week'].map((p) => (
            <motion.button
              key={p}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPeriod(p)}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                period === p
                  ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white shadow-lg'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-primary)]'
              }`}
            >
              {p === 'all' ? 'All Time' : p === 'month' ? 'This Month' : 'This Week'}
            </motion.button>
          ))}
        </motion.div>

        {/* Leaderboard List */}
        <div className="space-y-3">
          {users.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/profile/${user._id}`}>
                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  className={`card flex items-center gap-4 p-4 ${
                    index < 3 ? 'border-2 border-[var(--color-accent)] shadow-xl' : ''
                  }`}
                >
                  {/* Rank */}
                  <div className="flex-shrink-0 w-16 text-center">
                    <div className={`text-2xl font-bold ${
                      index < 3 ? 'text-3xl' : 'text-[var(--text-secondary)]'
                    }`}>
                      {getRankEmoji(index)}
                    </div>
                  </div>

                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className={`rounded-full border-2 ${
                          index < 3
                            ? 'w-16 h-16 border-[var(--color-accent)]'
                            : 'w-12 h-12 border-[var(--color-primary)]'
                        }`}
                      />
                    ) : (
                      <div
                        className={`rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-bold ${
                          index < 3 ? 'w-16 h-16 text-xl' : 'w-12 h-12 text-base'
                        }`}
                      >
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-lg text-[var(--text-primary)] truncate">
                      {user.username}
                    </div>
                    <div className="text-sm text-[var(--text-tertiary)]">
                      Member since {formatDate(user.createdAt)}
                    </div>
                  </div>

                  {/* Reputation */}
                  <div className="flex-shrink-0 text-right">
                    <div className={`font-bold ${
                      index < 3 ? 'text-2xl text-[var(--color-accent)]' : 'text-xl text-[var(--color-primary)]'
                    }`}>
                      {user.reputation.toLocaleString()}
                    </div>
                    <div className="text-xs text-[var(--text-tertiary)] font-medium">
                      reputation
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {users.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card text-center py-16"
          >
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold mb-2">No users found</h3>
            <p className="text-[var(--text-secondary)]">
              Be the first to earn reputation!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;

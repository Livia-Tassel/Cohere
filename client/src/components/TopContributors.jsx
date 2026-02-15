import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getLeaderboard } from '../services/api';

const TopContributors = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopUsers();
  }, []);

  const fetchTopUsers = async () => {
    try {
      const response = await getLeaderboard({ period: 'week', limit: 5 });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching top contributors:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex justify-center py-4">
          <div className="spinner w-5 h-5"></div>
        </div>
      </div>
    );
  }

  if (users.length === 0) return null;

  return (
    <div className="card">
      <h3 className="text-sm font-semibold mb-3 text-[var(--text-primary)] flex items-center gap-1.5">
        <span className="text-base">⭐</span>
        Top Contributors This Week
      </h3>
      <div className="space-y-2">
        {users.map((user, index) => (
          <Link
            key={user._id}
            to={`/profile/${user._id}`}
            className="block"
          >
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 4 }}
              className="flex items-center gap-2 p-2 rounded-[var(--radius-md)] hover:bg-[var(--bg-tertiary)] transition-all"
            >
              <div className="flex-shrink-0 w-6 text-center">
                {index === 0 && <span className="text-sm">🥇</span>}
                {index === 1 && <span className="text-sm">🥈</span>}
                {index === 2 && <span className="text-sm">🥉</span>}
                {index > 2 && <span className="text-xs text-[var(--text-tertiary)] font-medium">#{index + 1}</span>}
              </div>
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-7 h-7 rounded-full border border-[var(--border-primary)]"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white text-[10px] font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-[var(--text-primary)] truncate">
                  {user.username}
                </div>
                <div className="text-[10px] text-[var(--text-tertiary)]">
                  {user.reputation} rep
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
      <Link
        to="/leaderboard"
        className="block mt-3 pt-3 border-t border-[var(--border-primary)] text-center text-xs font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-light)] transition-colors"
      >
        View Full Leaderboard →
      </Link>
    </div>
  );
};

export default TopContributors;

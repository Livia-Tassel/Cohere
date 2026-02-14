import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getUserBadges } from '../services/api';

const UserBadges = ({ userId }) => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBadges();
  }, [userId]);

  const fetchBadges = async () => {
    try {
      const response = await getUserBadges(userId);
      setBadges(response.data);
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'gold':
        return 'from-yellow-400 to-yellow-600';
      case 'silver':
        return 'from-gray-300 to-gray-500';
      case 'bronze':
        return 'from-orange-400 to-orange-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const getTierBorder = (tier) => {
    switch (tier) {
      case 'gold':
        return 'border-yellow-500';
      case 'silver':
        return 'border-gray-400';
      case 'bronze':
        return 'border-orange-500';
      default:
        return 'border-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="spinner w-6 h-6"></div>
      </div>
    );
  }

  if (badges.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--text-tertiary)]">
        <p className="text-3xl mb-2">🏅</p>
        <p className="text-sm">No badges earned yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
        <span>🏅</span>
        Badges ({badges.length})
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {badges.map((userBadge, index) => (
          <motion.div
            key={userBadge._id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05, y: -4 }}
            className={`relative group cursor-pointer`}
          >
            <div
              className={`p-4 rounded-xl border-2 ${getTierBorder(
                userBadge.badge.tier
              )} bg-gradient-to-br ${getTierColor(
                userBadge.badge.tier
              )} shadow-lg`}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{userBadge.badge.icon}</div>
                <div className="text-xs font-bold text-white truncate">
                  {userBadge.badge.name}
                </div>
              </div>
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 w-48">
              <div className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                {userBadge.badge.name}
              </div>
              <div className="text-xs text-[var(--text-secondary)] mb-2">
                {userBadge.badge.description}
              </div>
              <div className="text-xs text-[var(--text-tertiary)]">
                Earned {new Date(userBadge.earnedAt).toLocaleDateString()}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UserBadges;

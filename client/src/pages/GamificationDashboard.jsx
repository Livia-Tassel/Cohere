import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGamificationStats, getDailyTaskProgress, getAchievementProgress } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const GamificationDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [dailyTasks, setDailyTasks] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [statsRes, tasksRes, achievementsRes] = await Promise.all([
        getGamificationStats(),
        getDailyTaskProgress(),
        getAchievementProgress()
      ]);

      setStats(statsRes.data);
      setDailyTasks(tasksRes.data);
      setAchievements(achievementsRes.data);
    } catch (error) {
      console.error('Error loading gamification data:', error);
      toast.error('Failed to load gamification data');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎮</div>
          <h2 className="text-2xl font-bold mb-4">Login to View Your Progress</h2>
          <Link to="/login">
            <button className="btn-primary">Login</button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  const progressPercentage = (stats.xpProgress / stats.xpNeeded) * 100;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Your Progress</h1>
          <p className="text-[var(--text-secondary)]">Track your achievements and daily goals</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Level Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-lg p-6 text-white"
          >
            <div className="text-sm opacity-90 mb-1">Level</div>
            <div className="text-4xl font-bold mb-2">{stats.level}</div>
            <div className="text-xs opacity-75">
              {stats.xpProgress} / {stats.xpNeeded} XP
            </div>
            <div className="mt-3 bg-white/20 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-white"
              />
            </div>
          </motion.div>

          {/* XP Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg p-6"
          >
            <div className="text-sm text-[var(--text-secondary)] mb-1">Total XP</div>
            <div className="text-3xl font-bold text-[var(--color-accent)]">{stats.xp}</div>
            <div className="text-xs text-[var(--text-tertiary)] mt-2">
              Next level: {stats.xpForNextLevel} XP
            </div>
          </motion.div>

          {/* Streak Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg p-6"
          >
            <div className="text-sm text-[var(--text-secondary)] mb-1">Current Streak</div>
            <div className="text-3xl font-bold text-orange-500 flex items-center gap-2">
              🔥 {stats.streak.currentStreak}
            </div>
            <div className="text-xs text-[var(--text-tertiary)] mt-2">
              Best: {stats.streak.longestStreak} days
            </div>
          </motion.div>

          {/* Reputation Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg p-6"
          >
            <div className="text-sm text-[var(--text-secondary)] mb-1">Reputation</div>
            <div className="text-3xl font-bold text-[var(--color-secondary)]">{stats.reputation}</div>
            <div className="text-xs text-[var(--text-tertiary)] mt-2">
              Community standing
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-[var(--border-primary)]">
          {['overview', 'tasks', 'achievements'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Daily Tasks Preview */}
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span>📋</span> Daily Tasks
                </h3>
                <div className="space-y-3">
                  {dailyTasks.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.task.icon}</span>
                        <div>
                          <div className="text-sm font-medium">{item.task.name}</div>
                          <div className="text-xs text-[var(--text-tertiary)]">
                            {item.progress}/{item.task.target}
                          </div>
                        </div>
                      </div>
                      {item.completed ? (
                        <span className="text-green-500 text-xl">✓</span>
                      ) : (
                        <span className="text-xs text-[var(--text-secondary)]">
                          +{item.task.xpReward} XP
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className="mt-4 text-sm text-[var(--color-primary)] hover:underline"
                >
                  View all tasks →
                </button>
              </div>

              {/* Recent Achievements */}
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span>🏆</span> Recent Achievements
                </h3>
                <div className="space-y-3">
                  {achievements
                    .filter((a) => a.completed)
                    .slice(0, 3)
                    .map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-3xl">{item.achievement.icon}</span>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{item.achievement.name}</div>
                          <div className="text-xs text-[var(--text-tertiary)]">
                            {item.achievement.description}
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          item.achievement.tier === 'diamond' ? 'bg-cyan-500/20 text-cyan-500' :
                          item.achievement.tier === 'platinum' ? 'bg-purple-500/20 text-purple-500' :
                          item.achievement.tier === 'gold' ? 'bg-yellow-500/20 text-yellow-500' :
                          item.achievement.tier === 'silver' ? 'bg-gray-400/20 text-gray-400' :
                          'bg-orange-500/20 text-orange-500'
                        }`}>
                          {item.achievement.tier}
                        </span>
                      </div>
                    ))}
                </div>
                <button
                  onClick={() => setActiveTab('achievements')}
                  className="mt-4 text-sm text-[var(--color-primary)] hover:underline"
                >
                  View all achievements →
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'tasks' && (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Daily Tasks</h3>
                <div className="space-y-4">
                  {dailyTasks.map((item, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        item.completed
                          ? 'bg-green-50 dark:bg-green-900/10 border-green-500'
                          : 'bg-[var(--bg-tertiary)] border-[var(--border-primary)]'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{item.task.icon}</span>
                          <div>
                            <div className="font-semibold">{item.task.name}</div>
                            <div className="text-sm text-[var(--text-secondary)]">
                              {item.task.description}
                            </div>
                          </div>
                        </div>
                        {item.completed ? (
                          <span className="text-green-500 text-2xl">✓</span>
                        ) : (
                          <span className="text-sm font-semibold text-[var(--color-accent)]">
                            +{item.task.xpReward} XP
                          </span>
                        )}
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)] mb-1">
                          <span>Progress</span>
                          <span>
                            {item.progress}/{item.task.target}
                          </span>
                        </div>
                        <div className="bg-[var(--bg-primary)] rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.progress / item.task.target) * 100}%` }}
                            className={`h-full ${
                              item.completed ? 'bg-green-500' : 'bg-[var(--color-primary)]'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-lg border ${
                      item.completed
                        ? 'bg-[var(--bg-secondary)] border-[var(--color-primary)]'
                        : 'bg-[var(--bg-tertiary)] border-[var(--border-primary)] opacity-60'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-5xl mb-2">{item.achievement.icon}</div>
                      <div className="font-semibold mb-1">{item.achievement.name}</div>
                      <div className="text-xs text-[var(--text-secondary)] mb-2">
                        {item.achievement.description}
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          item.achievement.tier === 'diamond' ? 'bg-cyan-500/20 text-cyan-500' :
                          item.achievement.tier === 'platinum' ? 'bg-purple-500/20 text-purple-500' :
                          item.achievement.tier === 'gold' ? 'bg-yellow-500/20 text-yellow-500' :
                          item.achievement.tier === 'silver' ? 'bg-gray-400/20 text-gray-400' :
                          'bg-orange-500/20 text-orange-500'
                        }`}>
                          {item.achievement.tier}
                        </span>
                        <span className="text-xs text-[var(--text-tertiary)]">
                          +{item.achievement.xpReward} XP
                        </span>
                      </div>
                      {!item.completed && item.achievement.criteria.type === 'count' && (
                        <div className="mt-3">
                          <div className="text-xs text-[var(--text-tertiary)] mb-1">
                            {item.progress}/{item.achievement.criteria.target}
                          </div>
                          <div className="bg-[var(--bg-primary)] rounded-full h-1.5 overflow-hidden">
                            <div
                              className="h-full bg-[var(--color-primary)]"
                              style={{
                                width: `${(item.progress / item.achievement.criteria.target) * 100}%`
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GamificationDashboard;

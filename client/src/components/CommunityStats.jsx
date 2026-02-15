import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CommunityStats = () => {
  // These would normally come from an API
  const stats = [
    {
      icon: '👥',
      value: '10K+',
      label: 'Active Users',
      color: 'text-[var(--color-primary)]'
    },
    {
      icon: '❓',
      value: '50K+',
      label: 'Questions',
      color: 'text-[var(--color-secondary)]'
    },
    {
      icon: '✅',
      value: '85%',
      label: 'Answered',
      color: 'text-[var(--color-success)]'
    },
    {
      icon: '⚡',
      value: '< 2h',
      label: 'Avg Response',
      color: 'text-[var(--color-accent)]'
    }
  ];

  return (
    <div className="card">
      <h3 className="text-sm font-semibold mb-3 text-[var(--text-primary)] flex items-center gap-1.5">
        <span className="text-base">📈</span>
        Community Stats
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="text-center p-2 rounded-[var(--radius-md)] bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] transition-all"
          >
            <div className="text-xl mb-1">{stat.icon}</div>
            <div className={`text-lg font-bold ${stat.color} mb-0.5`}>
              {stat.value}
            </div>
            <div className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wide">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CommunityStats;

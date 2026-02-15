import { motion } from 'framer-motion';

const QuestionStats = ({ question }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const stats = [
    {
      label: 'Asked',
      value: formatDate(question.createdAt),
      icon: '📅'
    },
    {
      label: 'Viewed',
      value: `${question.views} times`,
      icon: '👁️'
    },
    {
      label: 'Active',
      value: formatDate(question.updatedAt),
      icon: '⚡'
    }
  ];

  return (
    <div className="card">
      <h3 className="text-sm font-semibold mb-3 text-[var(--text-primary)] flex items-center gap-1.5">
        <span className="text-base">📊</span>
        Question Stats
      </h3>
      <div className="space-y-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">{stat.icon}</span>
              <span className="text-xs text-[var(--text-secondary)]">{stat.label}</span>
            </div>
            <span className="text-xs font-medium text-[var(--text-primary)]">{stat.value}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default QuestionStats;

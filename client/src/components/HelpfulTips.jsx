import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HelpfulTips = () => {
  const tips = [
    {
      icon: '💡',
      title: 'Be Specific',
      description: 'Include error messages and what you\'ve tried'
    },
    {
      icon: '📝',
      title: 'Format Code',
      description: 'Use code blocks for better readability'
    },
    {
      icon: '🔍',
      title: 'Search First',
      description: 'Your question might already be answered'
    },
    {
      icon: '✅',
      title: 'Accept Answers',
      description: 'Mark helpful answers as accepted'
    }
  ];

  return (
    <div className="card bg-gradient-to-br from-[var(--color-secondary)]/10 to-[var(--color-accent)]/10 border-[var(--color-secondary)]/30">
      <h3 className="text-sm font-semibold mb-3 text-[var(--text-primary)] flex items-center gap-1.5">
        <span className="text-base">📚</span>
        Helpful Tips
      </h3>
      <div className="space-y-2.5">
        {tips.map((tip, index) => (
          <motion.div
            key={tip.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-2"
          >
            <span className="text-lg flex-shrink-0">{tip.icon}</span>
            <div>
              <div className="text-xs font-semibold text-[var(--text-primary)] mb-0.5">
                {tip.title}
              </div>
              <div className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                {tip.description}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <Link
        to="/help"
        className="block mt-3 pt-3 border-t border-[var(--border-primary)] text-center text-xs font-medium text-[var(--color-secondary)] hover:text-[var(--color-secondary)]/80 transition-colors"
      >
        Learn More →
      </Link>
    </div>
  );
};

export default HelpfulTips;

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AskQuestionWidget = () => {
  const { user } = useAuth();

  return (
    <div className="card bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 border-[var(--color-primary)]/30">
      <div className="text-center">
        <div className="text-3xl mb-2">💡</div>
        <h3 className="text-sm font-semibold mb-2 text-[var(--text-primary)]">
          Have a Question?
        </h3>
        <p className="text-xs text-[var(--text-secondary)] mb-3 leading-relaxed">
          Get help from our community of developers
        </p>
        <Link to={user ? '/ask' : '/login'}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full btn-primary text-xs px-4 py-2"
          >
            Ask a Question
          </motion.button>
        </Link>
      </div>
    </div>
  );
};

export default AskQuestionWidget;

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { vote as voteApi } from '../services/api';
import toast from 'react-hot-toast';

const VoteButtons = ({ targetType, targetId, initialVotes, userVote, onVoteChange }) => {
  const { user } = useAuth();
  const [votes, setVotes] = useState(initialVotes);
  const [currentVote, setCurrentVote] = useState(userVote || 0);
  const [loading, setLoading] = useState(false);

  const handleVote = async (value) => {
    if (!user) {
      toast.error('Please login to vote');
      return;
    }

    if (loading) return;

    setLoading(true);
    try {
      const response = await voteApi({ targetType, targetId, value });
      const voteChange = response.data.voteChange;

      setVotes(votes + voteChange);

      if (currentVote === value) {
        setCurrentVote(0);
      } else {
        setCurrentVote(value);
      }

      if (onVoteChange) {
        onVoteChange(voteChange);
      }

      toast.success('Vote recorded!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Vote failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleVote(1)}
        disabled={loading}
        className={`p-2 rounded-full transition-all ${
          currentVote === 1
            ? 'bg-[var(--color-primary)] text-white shadow-lg'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 3l7 7h-4v7H7v-7H3l7-7z" />
        </svg>
      </motion.button>

      <motion.span
        key={votes}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        className="text-2xl font-bold text-[var(--color-dark)]"
      >
        {votes}
      </motion.span>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleVote(-1)}
        disabled={loading}
        className={`p-2 rounded-full transition-all ${
          currentVote === -1
            ? 'bg-red-500 text-white shadow-lg'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 17l-7-7h4V3h6v7h4l-7 7z" />
        </svg>
      </motion.button>
    </div>
  );
};

export default VoteButtons;

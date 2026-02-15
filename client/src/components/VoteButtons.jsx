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
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={() => handleVote(1)}
        disabled={loading}
        className={`p-1 rounded transition-all ${
          currentVote === 1
            ? 'text-[var(--color-primary)]'
            : 'text-[var(--text-tertiary)] hover:text-[var(--color-primary)]'
        }`}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 3l7 7h-4v7H7v-7H3l7-7z" />
        </svg>
      </button>

      <span className={`text-base font-semibold ${
        votes > 0 ? 'text-green-600' : votes < 0 ? 'text-red-600' : 'text-[var(--text-secondary)]'
      }`}>
        {votes}
      </span>

      <button
        onClick={() => handleVote(-1)}
        disabled={loading}
        className={`p-1 rounded transition-all ${
          currentVote === -1
            ? 'text-red-500'
            : 'text-[var(--text-tertiary)] hover:text-red-500'
        }`}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 17l-7-7h4V3h6v7h4l-7 7z" />
        </svg>
      </button>
    </div>
  );
};

export default VoteButtons;

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createBookmark, deleteBookmark, checkBookmarks } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const BookmarkButton = ({ questionId, size = 'md' }) => {
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if question is bookmarked on mount
    const checkBookmarkStatus = async () => {
      if (!user) return;

      try {
        const response = await checkBookmarks([questionId]);
        setIsBookmarked(response.data.bookmarkedIds.includes(questionId));
      } catch (error) {
        console.error('Error checking bookmark status:', error);
      }
    };

    checkBookmarkStatus();
  }, [questionId, user]);

  const handleToggleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please login to bookmark questions');
      return;
    }

    setLoading(true);

    try {
      if (isBookmarked) {
        await deleteBookmark(questionId);
        setIsBookmarked(false);
        toast.success('Bookmark removed');
      } else {
        await createBookmark(questionId);
        setIsBookmarked(true);
        toast.success('Question bookmarked');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error(error.response?.data?.message || 'Failed to update bookmark');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleToggleBookmark}
      disabled={loading}
      className={`${sizeClasses[size]} flex items-center justify-center rounded-lg transition-all ${
        isBookmarked
          ? 'bg-[var(--color-accent)] text-white shadow-md'
          : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--color-accent)]'
      } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
      title={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
    >
      <motion.span
        initial={false}
        animate={{ scale: isBookmarked ? [1, 1.3, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        {isBookmarked ? '🔖' : '📑'}
      </motion.span>
    </motion.button>
  );
};

export default BookmarkButton;

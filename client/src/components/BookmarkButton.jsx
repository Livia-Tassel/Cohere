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
    sm: 'w-6 h-6 text-xs',
    md: 'w-7 h-7 text-sm',
    lg: 'w-8 h-8 text-base'
  };

  return (
    <button
      onClick={handleToggleBookmark}
      disabled={loading}
      className={`${sizeClasses[size]} flex items-center justify-center rounded transition-all ${
        isBookmarked
          ? 'bg-[var(--color-accent)] text-white'
          : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--color-accent)]'
      } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
      title={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
    >
      {isBookmarked ? '🔖' : '📑'}
    </button>
  );
};

export default BookmarkButton;

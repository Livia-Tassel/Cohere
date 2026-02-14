import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getComments, createComment } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Comment from './Comment';
import toast from 'react-hot-toast';

const CommentList = ({ targetType, targetId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [targetType, targetId, sortBy]);

  const fetchComments = async () => {
    try {
      const response = await getComments(targetType, targetId, { sort: sortBy, limit: 100 });
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to comment');
      return;
    }

    if (newComment.trim().length === 0) {
      toast.error('Comment cannot be empty');
      return;
    }

    if (newComment.length > 500) {
      toast.error('Comment must be less than 500 characters');
      return;
    }

    setSubmitting(true);
    try {
      const response = await createComment({
        body: newComment,
        targetType,
        targetId
      });
      setComments([response.data, ...comments]);
      setNewComment('');
      toast.success('Comment added');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (commentId) => {
    setComments(comments.filter(c => c._id !== commentId));
  };

  const handleUpdate = (updatedComment) => {
    setComments(comments.map(c => c._id === updatedComment._id ? updatedComment : c));
  };

  const displayedComments = showAll ? comments : comments.slice(0, 3);

  return (
    <div className="mt-6 pt-6 border-t-2 border-[var(--border-primary)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold text-[var(--text-primary)]">
          Comments ({comments.length})
        </h4>
        {comments.length > 0 && (
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 text-sm border border-[var(--border-primary)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:border-[var(--color-primary)] focus:outline-none"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="votes">Most Votes</option>
          </select>
        )}
      </div>

      {/* Comment Form */}
      {user && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              maxLength={500}
              className="w-full px-4 py-3 border-2 border-[var(--border-primary)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:border-[var(--color-primary)] focus:outline-none resize-none"
              rows={2}
            />
            <div className="absolute bottom-2 right-2 text-xs text-[var(--text-tertiary)]">
              {newComment.length}/500
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-[var(--text-tertiary)]">
              Be respectful and constructive
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={submitting || newComment.trim().length === 0}
              className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Posting...' : 'Add Comment'}
            </motion.button>
          </div>
        </form>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="spinner"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-[var(--text-tertiary)]">
          <p className="text-2xl mb-2">💬</p>
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <>
          <div className="space-y-0">
            <AnimatePresence>
              {displayedComments.map((comment) => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Show More/Less Button */}
          {comments.length > 3 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAll(!showAll)}
              className="mt-4 w-full py-2 text-sm font-semibold text-[var(--color-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
            >
              {showAll ? 'Show Less' : `Show ${comments.length - 3} More Comments`}
            </motion.button>
          )}
        </>
      )}
    </div>
  );
};

export default CommentList;

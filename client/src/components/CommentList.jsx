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
    <div className="mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-primary)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-[var(--space-2)]">
        <h4 className="text-sm font-semibold text-[var(--text-primary)]">
          Comments ({comments.length})
        </h4>
        {comments.length > 0 && (
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2 py-1 text-xs border border-[var(--border-primary)] rounded-[var(--radius-md)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:border-[var(--border-focus)] focus:outline-none focus:shadow-[0_0_0_2px_var(--glow-primary)] transition-all duration-[var(--transition-fast)]"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="votes">Most Votes</option>
          </select>
        )}
      </div>

      {/* Comment Form */}
      {user && (
        <form onSubmit={handleSubmit} className="mb-[var(--space-2)]">
          <div className="relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              maxLength={500}
              className="w-full px-3 py-2 text-sm border border-[var(--border-primary)] rounded-[var(--radius-lg)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:border-[var(--border-focus)] focus:outline-none focus:shadow-[0_0_0_3px_var(--glow-primary)] transition-all duration-[var(--transition-fast)] resize-none"
              rows={2}
            />
            <div className="absolute bottom-1.5 right-2 text-[10px] text-[var(--text-tertiary)]">
              {newComment.length}/500
            </div>
          </div>
          <div className="flex items-center justify-end mt-[var(--space-1)]">
            <button
              type="submit"
              disabled={submitting || newComment.trim().length === 0}
              className="px-3 py-1.5 bg-[var(--color-primary)] text-white rounded-[var(--radius-md)] text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-primary-dark)] transition-all duration-[var(--transition-fast)] shadow-[var(--shadow-1)] hover:shadow-[var(--shadow-2)]"
            >
              {submitting ? 'Posting...' : 'Add Comment'}
            </button>
          </div>
        </form>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-4">
          <div className="spinner w-5 h-5"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-4 text-[var(--text-tertiary)] text-xs">
          <p className="text-lg mb-1">💬</p>
          <p>No comments yet</p>
        </div>
      ) : (
        <>
          <div className="space-y-0">
            {displayedComments.map((comment) => (
              <Comment
                key={comment._id}
                comment={comment}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}
          </div>

          {/* Show More/Less Button */}
          {comments.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="mt-[var(--space-1)] w-full py-1.5 text-xs font-medium text-[var(--color-primary)] hover:bg-[var(--bg-tertiary)] rounded-[var(--radius-md)] transition-all duration-[var(--transition-fast)]"
            >
              {showAll ? 'Show Less' : `Show ${comments.length - 3} More`}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default CommentList;

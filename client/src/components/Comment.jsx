import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { updateComment, deleteComment, voteComment } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Comment = ({ comment, onDelete, onUpdate }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editBody, setEditBody] = useState(comment.body);
  const [localVotes, setLocalVotes] = useState(comment.votes);
  const [hasVoted, setHasVoted] = useState(false);

  const isAuthor = user && user.id === comment.author._id;

  const formatDate = (date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInSeconds = Math.floor((now - commentDate) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return commentDate.toLocaleDateString();
  };

  const handleEdit = async () => {
    if (editBody.trim().length === 0) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      const response = await updateComment(comment._id, { body: editBody });
      onUpdate(response.data);
      setIsEditing(false);
      toast.success('Comment updated');
    } catch (error) {
      toast.error('Failed to update comment');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await deleteComment(comment._id);
      onDelete(comment._id);
      toast.success('Comment deleted');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  const handleVote = async () => {
    if (!user) {
      toast.error('Please login to vote');
      return;
    }

    if (hasVoted) {
      toast.error('You already voted on this comment');
      return;
    }

    try {
      const response = await voteComment(comment._id);
      setLocalVotes(response.data.votes);
      setHasVoted(true);
      toast.success('Upvoted!');
    } catch (error) {
      toast.error('Failed to vote');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex gap-3 py-3 border-b border-[var(--border-primary)] last:border-0"
    >
      {/* Vote Button */}
      <div className="flex-shrink-0">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleVote}
          disabled={hasVoted || isAuthor}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
            hasVoted
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--color-primary)] hover:text-white'
          } ${(hasVoted || isAuthor) ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={isAuthor ? 'Cannot vote on own comment' : hasVoted ? 'Already voted' : 'Upvote'}
        >
          {localVotes}
        </motion.button>
      </div>

      {/* Comment Content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              maxLength={500}
              className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:border-[var(--color-primary)] focus:outline-none resize-none"
              rows={2}
              autoFocus
            />
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEdit}
                className="px-3 py-1 bg-[var(--color-primary)] text-white rounded-lg text-sm font-semibold"
              >
                Save
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsEditing(false);
                  setEditBody(comment.body);
                }}
                className="px-3 py-1 bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-lg text-sm font-semibold"
              >
                Cancel
              </motion.button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-[var(--text-primary)] text-sm mb-2 break-words">
              {comment.body}
            </p>
            <div className="flex items-center gap-3 text-xs text-[var(--text-tertiary)]">
              <Link
                to={`/profile/${comment.author._id}`}
                className="font-semibold text-[var(--color-primary)] hover:underline"
              >
                {comment.author.username}
              </Link>
              <span>{comment.author.reputation} rep</span>
              <span>•</span>
              <span>{formatDate(comment.createdAt)}</span>
              {isAuthor && (
                <>
                  <span>•</span>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-[var(--color-secondary)] hover:underline"
                  >
                    edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-red-600 hover:underline"
                  >
                    delete
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Comment;

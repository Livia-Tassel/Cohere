import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import VoteButtons from './VoteButtons';
import CommentList from './CommentList';
import toast from 'react-hot-toast';
import { highlightAllCode } from '../utils/highlightCode';

const AnswerCard = ({ answer, onDelete, onEdit, onAccept, isQuestionAuthor, isAccepted }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editBody, setEditBody] = useState(answer.body);
  const answerBodyRef = useRef(null);

  const isAuthor = user && user.id === answer.author._id;

  // Apply syntax highlighting after answer loads
  useEffect(() => {
    if (answerBodyRef.current) {
      highlightAllCode();
    }
  }, [answer.body]);

  const handleEdit = async () => {
    try {
      await onEdit(answer._id, editBody);
      setIsEditing(false);
      toast.success('Answer updated!');
    } catch (error) {
      toast.error('Failed to update answer');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`card ${isAccepted ? 'border-[var(--color-success)] bg-[var(--color-success)]/5' : ''}`}>
      {isAccepted && (
        <div className="mb-3 flex items-center gap-2 text-green-600 font-semibold text-sm">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Accepted Answer
        </div>
      )}

      <div className="flex gap-[var(--space-4)]">
        <VoteButtons
          targetType="answer"
          targetId={answer._id}
          initialVotes={answer.votes}
        />

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div>
              <textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                className="w-full px-4 py-3 border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-[var(--radius-lg)] min-h-[150px] text-sm focus:border-[var(--border-focus)] focus:outline-none focus:shadow-[0_0_0_3px_var(--glow-primary)] transition-all"
              />
              <div className="mt-3 flex gap-2">
                <button
                  onClick={handleEdit}
                  className="btn-primary text-sm px-3 py-1.5"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary text-sm px-3 py-1.5"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div
                ref={answerBodyRef}
                className="prose max-w-none mb-4 text-sm"
                dangerouslySetInnerHTML={{ __html: answer.body }}
              />

              <div className="flex items-center justify-between pt-3 border-t border-[var(--border-primary)]">
                <div className="flex gap-2">
                  {isAuthor && (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-xs font-medium text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this answer?')) {
                            onDelete(answer._id);
                          }
                        }}
                        className="text-xs font-medium text-[var(--text-secondary)] hover:text-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </>
                  )}
                  {isQuestionAuthor && !isAccepted && (
                    <button
                      onClick={() => onAccept(answer._id)}
                      className="px-3 py-1 bg-green-500 text-white rounded text-xs font-semibold hover:bg-green-600 transition-colors"
                    >
                      ✓ Accept Answer
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {answer.author.avatar ? (
                    <img src={answer.author.avatar} alt={answer.author.username} className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white text-xs font-bold">
                      {answer.author.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-semibold text-[var(--text-primary)]">
                      {answer.author.username}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)]">
                      {answer.author.reputation} rep
                    </div>
                    <div className="text-xs text-[var(--text-tertiary)]">
                      answered {formatDate(answer.createdAt)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Answer Comments */}
              <CommentList targetType="Answer" targetId={answer._id} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;

import { motion } from 'framer-motion';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/AuthContext';
import VoteButtons from './VoteButtons';
import toast from 'react-hot-toast';

const AnswerCard = ({ answer, onDelete, onEdit, onAccept, isQuestionAuthor, isAccepted }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editBody, setEditBody] = useState(answer.body);

  const isAuthor = user && user.id === answer.author._id;

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card ${isAccepted ? 'border-4 border-green-500 bg-green-50' : ''}`}
    >
      {isAccepted && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mb-4 flex items-center gap-2 text-green-600 font-bold text-lg"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Accepted Answer
        </motion.div>
      )}

      <div className="flex gap-6">
        <VoteButtons
          targetType="answer"
          targetId={answer._id}
          initialVotes={answer.votes}
        />

        <div className="flex-1">
          {isEditing ? (
            <div>
              <textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                className="w-full p-4 border-2 border-gray-300 rounded-lg min-h-[200px] focus:border-[var(--color-primary)] focus:outline-none"
              />
              <div className="mt-4 flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEdit}
                  className="btn-primary"
                >
                  Save Changes
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          ) : (
            <>
              <div className="prose max-w-none mb-6">
                <ReactMarkdown>{answer.body}</ReactMarkdown>
              </div>

              <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
                <div className="flex gap-3">
                  {isAuthor && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsEditing(true)}
                        className="text-sm font-semibold text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors"
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (window.confirm('Delete this answer?')) {
                            onDelete(answer._id);
                          }
                        }}
                        className="text-sm font-semibold text-gray-600 hover:text-red-600 transition-colors"
                      >
                        Delete
                      </motion.button>
                    </>
                  )}
                  {isQuestionAuthor && !isAccepted && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onAccept(answer._id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
                    >
                      ✓ Accept Answer
                    </motion.button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {answer.author.avatar ? (
                    <img src={answer.author.avatar} alt={answer.author.username} className="avatar" />
                  ) : (
                    <div className="avatar bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-bold">
                      {answer.author.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-[var(--color-dark)]">
                      {answer.author.username}
                    </div>
                    <div className="text-sm text-gray-600">
                      {answer.author.reputation} rep
                    </div>
                    <div className="text-xs text-gray-500">
                      answered {formatDate(answer.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AnswerCard;

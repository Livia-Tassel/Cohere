import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import BookmarkButton from './BookmarkButton';
import toast from 'react-hot-toast';

const QuestionCard = ({ question, index = 0 }) => {
  const formatDate = (date) => {
    const now = new Date();
    const questionDate = new Date(date);
    const diffInSeconds = Math.floor((now - questionDate) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return questionDate.toLocaleDateString();
  };

  // Extract plain text from HTML for preview
  const getTextPreview = (html, maxLength = 200) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const getStatusChip = () => {
    const status = question.status || (question.acceptedAnswer ? 'answered' : 'open');
    switch (status) {
      case 'answered':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Answered</span>;
      case 'closed':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">Closed</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Open</span>;
    }
  };

  const handleCopyLink = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/questions/${question._id}`);
    toast.success('Link copied!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card group"
    >
      {/* Stats Column - Left Side */}
      <div className="flex gap-[var(--space-4)]">
        <div className="flex flex-col gap-[var(--space-2)] text-center min-w-[60px]">
            <div className="flex flex-col">
              <div className={`text-base font-bold ${question.votes > 0 ? 'text-green-600' : question.votes < 0 ? 'text-red-600' : 'text-[var(--text-secondary)]'}`}>
                {question.votes}
              </div>
              <div className="text-xs text-[var(--text-tertiary)]">votes</div>
            </div>

            <div className={`flex flex-col px-2 py-1 rounded ${question.answerCount > 0 ? (question.acceptedAnswer ? 'bg-green-100 dark:bg-green-900/30' : 'bg-blue-50 dark:bg-blue-900/20') : 'bg-[var(--bg-tertiary)]'}`}>
              <div className={`text-base font-bold ${question.acceptedAnswer ? 'text-green-600' : question.answerCount > 0 ? 'text-[var(--color-primary)]' : 'text-[var(--text-primary)]'}`}>
                {question.answerCount}
              </div>
              <div className="text-xs text-[var(--text-tertiary)]">
                {question.acceptedAnswer ? '✓' : 'ans'}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="text-sm text-[var(--text-secondary)] flex items-center justify-center gap-0.5">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {question.views}
              </div>
              <div className="text-xs text-[var(--text-tertiary)]">views</div>
            </div>
          </div>

          {/* Content Column - Right Side */}
          <div className="flex-1 min-w-0">
            {/* Title + Status */}
            <div className="flex items-start gap-2 mb-2">
              <Link
                to={`/questions/${question._id}`}
                className="flex-1 group-hover:text-[var(--color-primary)] transition-colors"
              >
                <h3 className="text-base font-semibold leading-snug line-clamp-2">
                  {question.title}
                </h3>
              </Link>
              {getStatusChip()}
            </div>

            {/* Body Preview */}
            <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2 leading-relaxed">
              {getTextPreview(question.body)}
            </p>

            {/* Tags and Meta Row */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {question.tags.slice(0, 3).map((tag) => (
                  <Link
                    key={tag}
                    to={`/tags/${tag}`}
                    className="tag"
                  >
                    {tag}
                  </Link>
                ))}
                {question.tags.length > 3 && (
                  <span className="px-2 py-0.5 text-xs text-[var(--text-tertiary)]">
                    +{question.tags.length - 3}
                  </span>
                )}
              </div>

              {/* Author and Time */}
              <div className="flex items-center gap-2">
                <Link
                  to={`/profile/${question.author._id}`}
                  className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                >
                  {question.author.avatar ? (
                    <img src={question.author.avatar} alt={question.author.username} className="w-5 h-5 rounded-full" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white text-[10px] font-bold">
                      {question.author.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-medium text-[var(--color-primary)]">
                    {question.author.username}
                  </span>
                </Link>
                <span className="text-xs text-[var(--text-tertiary)]">
                  {formatDate(question.createdAt)}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="text-[var(--text-tertiary)] hover:text-[var(--color-primary)] transition-colors p-0.5"
                  title="Copy link"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </button>
                <BookmarkButton questionId={question._id} size="sm" />
              </div>
            </div>
          </div>
        </div>
    </motion.div>
  );
};

export default QuestionCard;

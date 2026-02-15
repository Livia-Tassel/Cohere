import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import BookmarkButton from './BookmarkButton';

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

            <div className={`flex flex-col px-2 py-1 rounded ${question.acceptedAnswer ? 'bg-green-100 dark:bg-green-900/30' : 'bg-[var(--bg-tertiary)]'}`}>
              <div className={`text-base font-bold ${question.acceptedAnswer ? 'text-green-600' : 'text-[var(--text-primary)]'}`}>
                {question.answerCount}
              </div>
              <div className="text-xs text-[var(--text-tertiary)]">
                {question.acceptedAnswer ? '✓' : 'ans'}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="text-sm text-[var(--text-secondary)]">
                {question.views}
              </div>
              <div className="text-xs text-[var(--text-tertiary)]">views</div>
            </div>
          </div>

          {/* Content Column - Right Side */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <Link
              to={`/questions/${question._id}`}
              className="block mb-2 group-hover:text-[var(--color-primary)] transition-colors"
            >
              <h3 className="text-base font-semibold leading-snug line-clamp-2">
                {question.title}
              </h3>
            </Link>

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
                <BookmarkButton questionId={question._id} size="sm" />
              </div>
            </div>
          </div>
        </div>
    </motion.div>
  );
};

export default QuestionCard;

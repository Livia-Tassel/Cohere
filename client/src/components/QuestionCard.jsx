import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl border-2 border-gray-200 hover:border-[var(--color-primary)] transition-all duration-300 hover:shadow-xl group overflow-hidden"
    >
      <div className="p-6">
        {/* Title */}
        <Link
          to={`/questions/${question._id}`}
          className="block mb-4 group-hover:text-[var(--color-primary)] transition-colors"
        >
          <h3 className="text-xl font-bold leading-tight line-clamp-2">
            {question.title}
          </h3>
        </Link>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {question.tags.map((tag) => (
            <Link
              key={tag}
              to={`/tags/${tag}`}
              className="px-3 py-1 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] text-white text-xs font-semibold rounded-full hover:opacity-90 transition-opacity"
            >
              {tag}
            </Link>
          ))}
        </div>

        {/* Stats and Author Row */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* Stats */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <div className={`text-lg font-bold ${question.votes > 0 ? 'text-green-600' : question.votes < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                {question.votes}
              </div>
              <div className="text-xs text-gray-500 font-medium">votes</div>
            </div>

            <div className="flex items-center gap-1.5">
              <div className={`text-lg font-bold ${question.acceptedAnswer ? 'text-green-600' : 'text-gray-700'}`}>
                {question.answerCount}
              </div>
              <div className="text-xs text-gray-500 font-medium">
                {question.acceptedAnswer ? '✓ answers' : 'answers'}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="text-lg font-bold text-gray-500">
                {question.views}
              </div>
              <div className="text-xs text-gray-500 font-medium">views</div>
            </div>
          </div>

          {/* Author */}
          <Link
            to={`/profile/${question.author._id}`}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            {question.author.avatar ? (
              <img src={question.author.avatar} alt={question.author.username} className="w-8 h-8 rounded-full border-2 border-[var(--color-primary)]" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm">
                {question.author.username.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="text-right">
              <div className="text-sm font-semibold text-[var(--color-dark)]">
                {question.author.username}
              </div>
              <div className="text-xs text-gray-500">
                {formatDate(question.createdAt)}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default QuestionCard;

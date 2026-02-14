import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getRelatedQuestions } from '../services/api';

const RelatedQuestions = ({ questionId }) => {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRelated();
  }, [questionId]);

  const fetchRelated = async () => {
    try {
      const response = await getRelatedQuestions(questionId);
      setRelated(response.data);
    } catch (error) {
      console.error('Error fetching related questions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || related.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="card"
    >
      <h3 className="text-xl font-bold mb-4 text-[var(--text-primary)] flex items-center gap-2">
        <span>🔗</span>
        Related Questions
      </h3>
      <div className="space-y-3">
        {related.map((q) => (
          <Link
            key={q._id}
            to={`/questions/${q._id}`}
            className="block"
          >
            <motion.div
              whileHover={{ x: 4 }}
              className="p-3 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-elevated)] border border-[var(--border-primary)] hover:border-[var(--color-primary)] transition-all"
            >
              <div className="font-medium text-[var(--text-primary)] mb-2 line-clamp-2">
                {q.title}
              </div>
              <div className="flex items-center gap-4 text-xs text-[var(--text-tertiary)]">
                <span className={`font-semibold ${q.votes > 0 ? 'text-green-600' : 'text-[var(--text-secondary)]'}`}>
                  {q.votes} votes
                </span>
                <span className={q.acceptedAnswer ? 'text-green-600 font-semibold' : ''}>
                  {q.answerCount} answers
                </span>
                <span>{q.views} views</span>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

export default RelatedQuestions;

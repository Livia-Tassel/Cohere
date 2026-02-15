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
    <div className="card">
      <h3 className="text-sm font-semibold mb-3 text-[var(--text-primary)] flex items-center gap-1.5">
        <span className="text-base">🔗</span>
        Related Questions
      </h3>
      <div className="space-y-2">
        {related.map((q) => (
          <Link
            key={q._id}
            to={`/questions/${q._id}`}
            className="block p-2 rounded hover:bg-[var(--bg-tertiary)] border border-transparent hover:border-[var(--color-primary)] transition-all"
          >
            <div className="text-xs font-medium text-[var(--text-primary)] mb-1 line-clamp-2 leading-snug">
              {q.title}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-[var(--text-tertiary)]">
              <span className={`font-medium ${q.votes > 0 ? 'text-green-600' : 'text-[var(--text-secondary)]'}`}>
                {q.votes} votes
              </span>
              <span className={q.acceptedAnswer ? 'text-green-600 font-medium' : ''}>
                {q.answerCount} ans
              </span>
              <span>{q.views} views</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedQuestions;

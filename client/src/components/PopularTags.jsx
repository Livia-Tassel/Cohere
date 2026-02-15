import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getTags } from '../services/api';

const PopularTags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularTags();
  }, []);

  const fetchPopularTags = async () => {
    try {
      const response = await getTags();
      setTags(response.data.slice(0, 10));
    } catch (error) {
      console.error('Error fetching popular tags:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex justify-center py-4">
          <div className="spinner w-5 h-5"></div>
        </div>
      </div>
    );
  }

  if (tags.length === 0) return null;

  return (
    <div className="card">
      <h3 className="text-sm font-semibold mb-3 text-[var(--text-primary)] flex items-center gap-1.5">
        <span className="text-base">🏷️</span>
        Popular Tags
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag, index) => (
          <Link
            key={tag.name}
            to={`/tags/${tag.name}`}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="tag"
            >
              <span>{tag.name}</span>
              <span className="text-[10px] opacity-70">×{tag.count}</span>
            </motion.div>
          </Link>
        ))}
      </div>
      <Link
        to="/tags"
        className="block mt-3 pt-3 border-t border-[var(--border-primary)] text-center text-xs font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-light)] transition-colors"
      >
        View All Tags →
      </Link>
    </div>
  );
};

export default PopularTags;

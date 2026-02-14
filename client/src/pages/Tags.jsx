import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getTags } from '../services/api';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      const response = await getTags();
      setTags(response.data);
    } catch (error) {
      toast.error('Failed to load tags');
      console.error('Failed to load tags', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pattern flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pattern py-8">
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold mb-4 text-[var(--text-primary)]">Explore Tags</h1>
          <p className="text-xl text-[var(--text-secondary)]">
            Browse questions by technology and topic
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tags.map((tag, index) => (
            <motion.div
              key={tag.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/tags/${tag.name}`}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="card h-full"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-[var(--color-primary)]">
                      {tag.name}
                    </h3>
                    <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-lg flex items-center justify-center text-white font-bold">
                      {tag.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                    {tag.count}
                  </div>
                  <div className="text-sm text-[var(--text-tertiary)] uppercase tracking-wide">
                    Questions
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {tags.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card text-center py-16"
          >
            <div className="text-6xl mb-4">🏷️</div>
            <h3 className="text-2xl font-bold mb-2 text-[var(--text-primary)]">No tags yet</h3>
            <p className="text-[var(--text-secondary)]">Tags will appear as questions are posted</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Tags;

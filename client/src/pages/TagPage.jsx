import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTagQuestions } from '../services/api';
import QuestionCard from '../components/QuestionCard';
import toast, { Toaster } from 'react-hot-toast';

const TagPage = () => {
  const { name } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    loadQuestions();
  }, [name]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const response = await getTagQuestions(name);
      setQuestions(response.data.questions);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total
      });
    } catch (error) {
      toast.error('Failed to load questions');
      console.error('Failed to load tag questions', error);
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

      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-5xl font-bold">#{name}</h1>
              <p className="text-xl text-gray-600">
                {pagination.total || 0} questions tagged
              </p>
            </div>
          </div>

          <Link to="/tags">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-[var(--color-primary)] font-semibold hover:underline"
            >
              ← Back to all tags
            </motion.button>
          </Link>
        </motion.div>

        {questions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card text-center py-16"
          >
            <div className="text-6xl mb-4">🤔</div>
            <h3 className="text-2xl font-bold mb-2">No questions yet</h3>
            <p className="text-gray-600 mb-6">
              Be the first to ask a question about {name}!
            </p>
            <Link to="/ask">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary"
              >
                Ask Question
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {questions.map((question, index) => (
              <QuestionCard key={question._id} question={question} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagPage;

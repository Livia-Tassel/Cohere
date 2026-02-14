import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getBookmarks } from '../services/api';
import { useAuth } from '../context/AuthContext';
import QuestionCard from '../components/QuestionCard';
import toast from 'react-hot-toast';

const Bookmarks = () => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    fetchBookmarks();
  }, [user, currentPage]);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const response = await getBookmarks({ page: currentPage, limit: 10 });
      setBookmarks(response.data.bookmarks);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      toast.error('Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🔖</span>
            <h1 className="text-4xl font-bold text-gradient">
              My Bookmarks
            </h1>
          </div>
          <p className="text-[var(--text-secondary)] text-lg">
            Questions you've saved for later
          </p>
        </motion.div>

        {/* Bookmarks List */}
        {bookmarks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card text-center py-16"
          >
            <div className="text-6xl mb-4">📑</div>
            <h3 className="text-2xl font-bold mb-2">No bookmarks yet</h3>
            <p className="text-[var(--text-secondary)] mb-6">
              Start bookmarking questions to save them for later
            </p>
            <Link
              to="/"
              className="btn-primary inline-block"
            >
              Browse Questions
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="space-y-4">
              {bookmarks.map((bookmark, index) => (
                <QuestionCard
                  key={bookmark._id}
                  question={bookmark.question}
                  index={index}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center gap-2 mt-8"
              >
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex items-center gap-2 px-4">
                  <span className="text-[var(--text-secondary)]">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;

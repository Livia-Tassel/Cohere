import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getQuestions, getTags } from '../services/api';
import QuestionCard from '../components/QuestionCard';
import TagList from '../components/TagList';
import toast, { Toaster } from 'react-hot-toast';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});

  const sort = searchParams.get('sort') || 'newest';
  const search = searchParams.get('search') || '';
  const page = searchParams.get('page') || 1;

  useEffect(() => {
    loadQuestions();
    loadTags();
  }, [sort, search, page]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const response = await getQuestions({ sort, search, page });
      setQuestions(response.data.questions);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total
      });
    } catch (error) {
      toast.error('Failed to load questions');
      console.error('Failed to load questions', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const response = await getTags();
      setTags(response.data.slice(0, 20));
    } catch (error) {
      console.error('Failed to load tags', error);
    }
  };

  const handleSortChange = (newSort) => {
    setSearchParams({ sort: newSort });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchValue = e.target.search.value;
    setSearchParams({ search: searchValue });
  };

  return (
    <div className="min-h-screen bg-pattern">
      <Toaster position="top-right" />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-dark)] text-white py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          >
            Every Developer
            <br />
            <span className="text-[var(--color-accent)]">Has Questions</span>
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl mb-10 opacity-90 max-w-2xl"
          >
            Join our community of developers helping each other grow
          </motion.p>

          <motion.form
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3 max-w-3xl"
          >
            <input
              type="text"
              name="search"
              placeholder="Search questions..."
              defaultValue={search}
              className="flex-1 px-6 py-4 rounded-xl text-[var(--color-dark)] text-base focus:outline-none focus:ring-4 focus:ring-[var(--color-accent)] shadow-lg"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-8 py-4 bg-[var(--color-accent)] text-[var(--color-dark)] rounded-xl font-bold text-base hover:bg-white transition-colors shadow-lg"
            >
              Search
            </motion.button>
          </motion.form>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  {search ? `Results for "${search}"` : 'All Questions'}
                </h2>
                <p className="text-gray-600 text-lg">
                  {pagination.total || 0} questions
                </p>
              </div>
              <Link to="/ask">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary whitespace-nowrap"
                >
                  Ask Question
                </motion.button>
              </Link>
            </div>

            {/* Sort Buttons */}
            <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
              {['newest', 'votes', 'unanswered'].map((sortOption) => (
                <motion.button
                  key={sortOption}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSortChange(sortOption)}
                  className={`px-6 py-3 rounded-xl font-semibold uppercase tracking-wide transition-all whitespace-nowrap ${
                    sort === sortOption
                      ? 'bg-[var(--color-primary)] text-white shadow-lg'
                      : 'bg-white text-[var(--color-dark)] hover:bg-gray-50 border-2 border-gray-200'
                  }`}
                >
                  {sortOption}
                </motion.button>
              ))}
            </div>

            {/* Questions List */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="spinner"></div>
              </div>
            ) : questions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl border-2 border-gray-200 text-center py-20 px-6"
              >
                <div className="text-6xl mb-4">🤔</div>
                <h3 className="text-2xl font-bold mb-2">No questions found</h3>
                <p className="text-gray-600 mb-6">Be the first to ask a question!</p>
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
              <>
                <div className="space-y-5">
                  {questions.map((question, index) => (
                    <QuestionCard key={question._id} question={question} index={index} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-10 flex justify-center gap-2 flex-wrap"
                  >
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <motion.button
                        key={pageNum}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSearchParams({ sort, search, page: pageNum })}
                        className={`w-12 h-12 rounded-xl font-bold transition-all ${
                          pageNum === parseInt(pagination.currentPage)
                            ? 'bg-[var(--color-primary)] text-white shadow-lg'
                            : 'bg-white text-[var(--color-dark)] hover:bg-gray-50 border-2 border-gray-200'
                        }`}
                      >
                        {pageNum}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <TagList tags={tags} />

              {/* Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl border-2 border-gray-200 p-6 mt-6"
              >
                <h3 className="text-xl font-bold mb-6">Community Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Questions</span>
                    <span className="text-2xl font-bold text-[var(--color-primary)]">
                      {pagination.total || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Tags</span>
                    <span className="text-2xl font-bold text-[var(--color-secondary)]">
                      {tags.length}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

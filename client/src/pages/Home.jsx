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
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
              <div>
                <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
                  {search ? `Search Results` : 'All Questions'}
                </h1>
                <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                  {pagination.total || 0} questions
                </p>
              </div>
              <Link to="/ask">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary text-sm px-4 py-2"
                >
                  Ask Question
                </motion.button>
              </Link>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  name="search"
                  placeholder="Search questions..."
                  defaultValue={search}
                  className="flex-1 px-4 py-3 text-sm border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-[var(--radius-lg)] focus:border-[var(--border-focus)] focus:outline-none focus:shadow-[0_0_0_3px_var(--glow-primary)] transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg font-medium text-sm hover:bg-[var(--color-primary-dark)] transition-colors"
                >
                  Search
                </motion.button>
              </div>
            </form>

            {/* Sort Tabs */}
            <div className="flex gap-1 mb-4 border-b border-[var(--border-primary)]">
              {['newest', 'votes', 'unanswered'].map((sortOption) => (
                <button
                  key={sortOption}
                  onClick={() => handleSortChange(sortOption)}
                  className={`px-4 py-2 text-sm font-medium capitalize transition-colors relative ${
                    sort === sortOption
                      ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {sortOption}
                </button>
              ))}
            </div>

            {/* Questions List */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="spinner"></div>
              </div>
            ) : questions.length === 0 ? (
              <div className="bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)] text-center py-12 px-6">
                <div className="text-4xl mb-3">🤔</div>
                <h3 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">No questions found</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">Be the first to ask a question!</p>
                <Link to="/ask">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary text-sm px-4 py-2"
                  >
                    Ask Question
                  </motion.button>
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {questions.map((question, index) => (
                    <QuestionCard key={question._id} question={question} index={index} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-6 flex justify-center gap-1 flex-wrap">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setSearchParams({ sort, search, page: pageNum })}
                        className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                          pageNum === parseInt(pagination.currentPage)
                            ? 'bg-[var(--color-primary)] text-white'
                            : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-primary)]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Stats Card */}
            <div className="bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)] p-4">
              <h3 className="text-sm font-semibold mb-3 text-[var(--text-primary)]">Community Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--text-secondary)]">Questions</span>
                  <span className="text-lg font-bold text-[var(--color-primary)]">
                    {pagination.total || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--text-secondary)]">Tags</span>
                  <span className="text-lg font-bold text-[var(--color-secondary)]">
                    {tags.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <TagList tags={tags} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

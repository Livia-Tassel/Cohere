import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getQuestions, getTags, getTrendingQuestions } from '../services/api';
import QuestionCard from '../components/QuestionCard';
import TagList from '../components/TagList';
import toast from 'react-hot-toast';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [tags, setTags] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});

  const sort = searchParams.get('sort') || 'newest';
  const search = searchParams.get('search') || '';
  const page = searchParams.get('page') || 1;

  useEffect(() => {
    loadQuestions();
    loadTags();
    loadTrending();
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

  const loadTrending = async () => {
    try {
      const response = await getTrendingQuestions({ period: 'week' });
      setTrending(response.data.slice(0, 5));
    } catch (error) {
      console.error('Failed to load trending questions', error);
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

      <div className="max-w-7xl mx-auto px-4 py-[var(--space-4)] sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-[var(--space-4)]">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-[var(--space-3)] gap-[var(--space-2)]">
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
            <form onSubmit={handleSearch} className="mb-[var(--space-3)]">
              <div className="flex gap-[var(--space-2)]">
                <input
                  type="text"
                  name="search"
                  placeholder="Search questions..."
                  defaultValue={search}
                  className="flex-1 px-4 py-3 text-sm border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-[var(--radius-lg)] focus:border-[var(--border-focus)] focus:outline-none focus:shadow-[0_0_0_3px_var(--glow-primary)] transition-all duration-[var(--transition-fast)]"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-[var(--radius-lg)] font-medium text-sm hover:bg-[var(--color-primary-dark)] transition-colors duration-[var(--transition-fast)] shadow-[var(--shadow-2)]"
                >
                  Search
                </motion.button>
              </div>
            </form>

            {/* Sort Tabs */}
            <div className="flex gap-[var(--space-1)] mb-[var(--space-3)] border-b border-[var(--border-primary)]">
              {['newest', 'votes', 'unanswered'].map((sortOption) => (
                <button
                  key={sortOption}
                  onClick={() => handleSortChange(sortOption)}
                  className={`px-4 py-2 text-sm font-medium capitalize transition-all duration-[var(--transition-fast)] relative ${
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
              <div className="card text-center py-12 px-6">
                <div className="text-4xl mb-[var(--space-2)]">🤔</div>
                <h3 className="text-lg font-semibold mb-[var(--space-1)] text-[var(--text-primary)]">No questions found</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-[var(--space-3)]">Be the first to ask a question!</p>
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
                <div className="space-y-[var(--space-2)]">
                  {questions.map((question, index) => (
                    <QuestionCard key={question._id} question={question} index={index} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-[var(--space-4)] flex justify-center gap-[var(--space-1)] flex-wrap">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setSearchParams({ sort, search, page: pageNum })}
                        className={`w-10 h-10 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-[var(--transition-fast)] ${
                          pageNum === parseInt(pagination.currentPage)
                            ? 'bg-[var(--color-primary)] text-white shadow-[var(--shadow-2)]'
                            : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-primary)] hover:border-[var(--color-primary)]'
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
          <div className="lg:col-span-1 space-y-[var(--space-3)]">
            {/* Trending Questions */}
            {trending.length > 0 && (
              <div className="card">
                <h3 className="text-sm font-semibold mb-[var(--space-2)] text-[var(--text-primary)]">Trending This Week</h3>
                <div className="space-y-2">
                  {trending.map((q, i) => (
                    <Link
                      key={q._id}
                      to={`/questions/${q._id}`}
                      className="flex gap-2 group/trend"
                    >
                      <span className="text-xs font-bold text-[var(--text-tertiary)] mt-0.5 min-w-[16px]">{i + 1}.</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[var(--text-primary)] group-hover/trend:text-[var(--color-primary)] transition-colors line-clamp-2 leading-snug">
                          {q.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-[var(--text-tertiary)]">
                          <span>{q.votes} votes</span>
                          <span>{q.views} views</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Stats Card */}
            <div className="card">
              <h3 className="text-sm font-semibold mb-[var(--space-2)] text-[var(--text-primary)]">Community Stats</h3>
              <div className="space-y-[var(--space-2)]">
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

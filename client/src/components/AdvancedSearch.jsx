import { motion } from 'framer-motion';
import { useState } from 'react';

const AdvancedSearch = ({ onSearch, onClose }) => {
  const [filters, setFilters] = useState({
    query: '',
    tags: [],
    author: '',
    hasAcceptedAnswer: null,
    minVotes: '',
    maxVotes: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'newest'
  });

  const [tagInput, setTagInput] = useState('');

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!filters.tags.includes(tagInput.trim())) {
        setFilters({ ...filters, tags: [...filters.tags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFilters({ ...filters, tags: filters.tags.filter(t => t !== tag) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      query: '',
      tags: [],
      author: '',
      hasAcceptedAnswer: null,
      minVotes: '',
      maxVotes: '',
      dateFrom: '',
      dateTo: '',
      sortBy: 'newest'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card max-w-3xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Advanced Search</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Search Query */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
            Search Query
          </label>
          <input
            type="text"
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            placeholder="Enter keywords..."
            className="w-full px-4 py-3 border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-[var(--radius-lg)] focus:border-[var(--border-focus)] focus:outline-none focus:shadow-[0_0_0_3px_var(--glow-primary)] transition-all"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
            Tags
          </label>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Type a tag and press Enter..."
            className="w-full px-4 py-3 border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-[var(--radius-lg)] focus:border-[var(--border-focus)] focus:outline-none focus:shadow-[0_0_0_3px_var(--glow-primary)] transition-all"
          />
          {filters.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {filters.tags.map((tag) => (
                <motion.div
                  key={tag}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="tag cursor-pointer"
                  onClick={() => handleRemoveTag(tag)}
                >
                  {tag}
                  <span className="ml-1">×</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Author */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
            Author
          </label>
          <input
            type="text"
            value={filters.author}
            onChange={(e) => setFilters({ ...filters, author: e.target.value })}
            placeholder="Username..."
            className="w-full px-4 py-3 border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-[var(--radius-lg)] focus:border-[var(--border-focus)] focus:outline-none focus:shadow-[0_0_0_3px_var(--glow-primary)] transition-all"
          />
        </div>

        {/* Answer Status */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
            Answer Status
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setFilters({ ...filters, hasAcceptedAnswer: null })}
              className={`px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-all ${
                filters.hasAcceptedAnswer === null
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilters({ ...filters, hasAcceptedAnswer: true })}
              className={`px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-all ${
                filters.hasAcceptedAnswer === true
                  ? 'bg-[var(--color-success)] text-white'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
              }`}
            >
              Answered
            </button>
            <button
              type="button"
              onClick={() => setFilters({ ...filters, hasAcceptedAnswer: false })}
              className={`px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-all ${
                filters.hasAcceptedAnswer === false
                  ? 'bg-[var(--color-warning)] text-white'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
              }`}
            >
              Unanswered
            </button>
          </div>
        </div>

        {/* Vote Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
              Min Votes
            </label>
            <input
              type="number"
              value={filters.minVotes}
              onChange={(e) => setFilters({ ...filters, minVotes: e.target.value })}
              placeholder="0"
              className="w-full px-4 py-3 border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-[var(--radius-lg)] focus:border-[var(--border-focus)] focus:outline-none focus:shadow-[0_0_0_3px_var(--glow-primary)] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
              Max Votes
            </label>
            <input
              type="number"
              value={filters.maxVotes}
              onChange={(e) => setFilters({ ...filters, maxVotes: e.target.value })}
              placeholder="∞"
              className="w-full px-4 py-3 border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-[var(--radius-lg)] focus:border-[var(--border-focus)] focus:outline-none focus:shadow-[0_0_0_3px_var(--glow-primary)] transition-all"
            />
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
              From Date
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="w-full px-4 py-3 border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-[var(--radius-lg)] focus:border-[var(--border-focus)] focus:outline-none focus:shadow-[0_0_0_3px_var(--glow-primary)] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
              To Date
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="w-full px-4 py-3 border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-[var(--radius-lg)] focus:border-[var(--border-focus)] focus:outline-none focus:shadow-[0_0_0_3px_var(--glow-primary)] transition-all"
            />
          </div>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            className="w-full px-4 py-3 border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-[var(--radius-lg)] focus:border-[var(--border-focus)] focus:outline-none focus:shadow-[0_0_0_3px_var(--glow-primary)] transition-all"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="votes">Most Votes</option>
            <option value="views">Most Views</option>
            <option value="answers">Most Answers</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 btn-primary"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-6 btn-secondary"
          >
            Reset
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AdvancedSearch;

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createQuestion } from '../services/api';
import { useAuth } from '../context/AuthContext';
import RichTextEditor from '../components/RichTextEditor';
import toast from 'react-hot-toast';

const AVAILABLE_TAGS = [
  'javascript', 'python', 'react', 'nodejs', 'java', 'typescript',
  'html', 'css', 'mongodb', 'sql', 'git', 'docker', 'aws',
  'vue', 'angular', 'express', 'django', 'flask', 'spring',
  'nextjs', 'tailwind', 'graphql', 'redis', 'kubernetes'
];

const AskQuestion = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-pattern flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card text-center max-w-md"
        >
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-3xl font-bold mb-4 text-[var(--text-primary)]">Login Required</h2>
          <p className="text-[var(--text-secondary)] mb-6">
            Please login to ask a question
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            className="btn-primary"
          >
            Go to Login
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else if (selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag]);
    } else {
      toast.error('Maximum 5 tags allowed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedTags.length === 0) {
      toast.error('Please select at least one tag');
      return;
    }

    if (title.length < 10) {
      toast.error('Title must be at least 10 characters');
      return;
    }

    if (body.length < 20) {
      toast.error('Description must be at least 20 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await createQuestion({
        title,
        body,
        tags: selectedTags
      });
      toast.success('Question posted successfully!');
      navigate(`/questions/${response.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pattern py-[var(--space-6)]">

      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-[var(--space-4)]">
            <h1 className="text-5xl font-bold mb-[var(--space-3)] text-[var(--text-primary)]">Ask a Question</h1>
            <p className="text-xl text-[var(--text-secondary)]">
              Get help from our community of developers
            </p>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-[var(--space-4)]">
              {/* Title */}
              <div>
                <label className="block text-lg font-bold mb-[var(--space-2)] uppercase tracking-wide text-[var(--text-primary)]">
                  Question Title
                  <span className="text-[var(--color-primary)]"> *</span>
                </label>
                <p className="text-sm text-[var(--text-secondary)] mb-[var(--space-2)]">
                  Be specific and imagine you're asking a question to another person
                </p>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., How do I center a div in CSS?"
                  className="w-full px-4 py-3 border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-[var(--radius-lg)] focus:border-[var(--border-focus)] focus:outline-none focus:shadow-[0_0_0_3px_var(--glow-primary)] transition-all duration-[var(--transition-fast)] text-lg"
                  minLength={10}
                  maxLength={200}
                  required
                />
                <div className="mt-[var(--space-1)] text-sm text-[var(--text-tertiary)]">
                  {title.length}/200 characters
                </div>
              </div>

              {/* Body */}
              <div>
                <label className="block text-lg font-bold mb-[var(--space-2)] uppercase tracking-wide text-[var(--text-primary)]">
                  Detailed Description
                  <span className="text-[var(--color-primary)]"> *</span>
                </label>
                <p className="text-sm text-[var(--text-secondary)] mb-[var(--space-2)]">
                  Include all the information someone would need to answer your question. You can use rich formatting and add images.
                </p>
                <RichTextEditor
                  content={body}
                  onChange={setBody}
                  placeholder="Describe your problem in detail. Include what you've tried and what you expect to happen..."
                />
                <div className="mt-[var(--space-1)] text-sm text-[var(--text-tertiary)]">
                  Minimum 20 characters required
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-lg font-bold mb-[var(--space-2)] uppercase tracking-wide text-[var(--text-primary)]">
                  Tags
                  <span className="text-[var(--color-primary)]"> *</span>
                </label>
                <p className="text-sm text-[var(--text-secondary)] mb-[var(--space-2)]">
                  Add up to 5 tags to describe what your question is about
                </p>
                <div className="flex flex-wrap gap-[var(--space-1)] mb-[var(--space-3)]">
                  {AVAILABLE_TAGS.map((tag) => (
                    <motion.button
                      key={tag}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTagToggle(tag)}
                      className={`px-4 py-2 rounded-[var(--radius-lg)] font-semibold transition-all duration-[var(--transition-fast)] ${
                        selectedTags.includes(tag)
                          ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-[var(--shadow-3)]'
                          : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--border-primary)] border border-[var(--border-primary)]'
                      }`}
                    >
                      {tag}
                    </motion.button>
                  ))}
                </div>
                {selectedTags.length > 0 && (
                  <div className="p-[var(--space-3)] bg-blue-50 dark:bg-blue-900/20 rounded-[var(--radius-lg)] border border-blue-200 dark:border-blue-800">
                    <p className="text-sm font-semibold mb-[var(--space-1)]">Selected tags:</p>
                    <div className="flex flex-wrap gap-[var(--space-1)]">
                      {selectedTags.map((tag) => (
                        <span key={tag} className="badge badge-primary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-[var(--space-3)] pt-[var(--space-3)]">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="spinner w-5 h-5 border-2"></div>
                      <span className="ml-2">Posting...</span>
                    </div>
                  ) : (
                    'Post Your Question'
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => navigate('/')}
                  className="btn-secondary"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </div>

          {/* Tips Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card mt-[var(--space-4)] bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20"
          >
            <h3 className="text-xl font-bold mb-[var(--space-3)] text-[var(--text-primary)]">💡 Tips for a Great Question</h3>
            <ul className="space-y-[var(--space-1)] text-[var(--text-secondary)]">
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-2">•</span>
                <span>Make your title specific and descriptive</span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-2">•</span>
                <span>Include relevant code snippets and error messages</span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-2">•</span>
                <span>Explain what you've already tried</span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-2">•</span>
                <span>Use proper formatting and tags</span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-2">•</span>
                <span>Be respectful and clear in your communication</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AskQuestion;

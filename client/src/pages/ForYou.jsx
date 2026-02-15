import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getPersonalizedFeed, getActivityFeed, getFollowedTags, followTag, unfollowTag } from '../services/api';
import QuestionCard from '../components/QuestionCard';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ForYou = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personalized');
  const [questions, setQuestions] = useState([]);
  const [followedTags, setFollowedTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tagsRes] = await Promise.all([
        getFollowedTags()
      ]);

      setFollowedTags(tagsRes.data);

      if (activeTab === 'personalized') {
        const feedRes = await getPersonalizedFeed({ page: 1, limit: 20 });
        setQuestions(feedRes.data.questions);
        setPagination({
          currentPage: feedRes.data.currentPage,
          totalPages: feedRes.data.totalPages,
          total: feedRes.data.total
        });
      } else {
        const activityRes = await getActivityFeed({ page: 1, limit: 20 });
        setQuestions(activityRes.data.questions);
        setPagination({
          currentPage: activityRes.data.currentPage,
          totalPages: activityRes.data.totalPages,
          total: activityRes.data.total
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollowTag = async (tag) => {
    try {
      await unfollowTag(tag);
      setFollowedTags(followedTags.filter(t => t !== tag));
      toast.success(`Unfollowed ${tag}`);
      loadData();
    } catch (error) {
      toast.error('Failed to unfollow tag');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold mb-4">Login to See Your Personalized Feed</h2>
          <Link to="/login">
            <button className="btn-primary">Login</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">For You</h1>
              <p className="text-[var(--text-secondary)]">
                Personalized content based on your interests
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-[var(--border-primary)]">
              <button
                onClick={() => setActiveTab('personalized')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'personalized'
                    ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Personalized
              </button>
              <button
                onClick={() => setActiveTab('following')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'following'
                    ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Following
              </button>
            </div>

            {/* Questions */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="spinner"></div>
              </div>
            ) : questions.length === 0 ? (
              <div className="bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)] text-center py-12 px-6">
                <div className="text-4xl mb-3">
                  {activeTab === 'personalized' ? '🎯' : '👥'}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">
                  {activeTab === 'personalized'
                    ? 'No personalized content yet'
                    : 'No activity from followed users'}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  {activeTab === 'personalized'
                    ? 'Follow some tags to see personalized content'
                    : 'Follow some users to see their activity'}
                </p>
                <Link to="/tags">
                  <button className="btn-primary text-sm px-4 py-2">
                    Browse Tags
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {questions.map((question, index) => (
                  <QuestionCard key={question._id} question={question} index={index} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Followed Tags */}
            <div className="bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)] p-4">
              <h3 className="text-sm font-semibold mb-3 text-[var(--text-primary)]">
                Followed Tags
              </h3>
              {followedTags.length === 0 ? (
                <div className="text-xs text-[var(--text-tertiary)] text-center py-4">
                  <p className="mb-2">No tags followed yet</p>
                  <Link to="/tags">
                    <button className="text-[var(--color-primary)] hover:underline">
                      Browse tags
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {followedTags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center justify-between p-2 rounded bg-[var(--bg-tertiary)]"
                    >
                      <Link to={`/tags/${tag}`}>
                        <span className="text-xs font-medium text-[var(--color-primary)] hover:underline">
                          {tag}
                        </span>
                      </Link>
                      <button
                        onClick={() => handleUnfollowTag(tag)}
                        className="text-xs text-[var(--text-tertiary)] hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)] p-4">
              <h3 className="text-sm font-semibold mb-3 text-[var(--text-primary)]">
                Your Feed Stats
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--text-secondary)]">Total Questions</span>
                  <span className="font-semibold text-[var(--text-primary)]">
                    {pagination.total || 0}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--text-secondary)]">Followed Tags</span>
                  <span className="font-semibold text-[var(--text-primary)]">
                    {followedTags.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForYou;

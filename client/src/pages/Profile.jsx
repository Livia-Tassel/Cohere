import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUser, getUserQuestions, getUserAnswers, getUserActivity } from '../services/api';
import QuestionCard from '../components/QuestionCard';
import UserBadges from '../components/UserBadges';
import FriendButton from '../components/FriendButton';
import toast from 'react-hot-toast';

const ActivityHeatmap = ({ userId }) => {
  const [activity, setActivity] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivity = async () => {
      try {
        const response = await getUserActivity(userId);
        setActivity(response.data);
      } catch (error) {
        console.error('Failed to load activity', error);
      } finally {
        setLoading(false);
      }
    };
    loadActivity();
  }, [userId]);

  if (loading) return null;

  // Generate last 52 weeks of dates
  const today = new Date();
  const weeks = [];
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364);
  // Align to Sunday
  startDate.setDate(startDate.getDate() - startDate.getDay());

  for (let w = 0; w < 53; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + w * 7 + d);
      if (date <= today) {
        const dateStr = date.toISOString().split('T')[0];
        week.push({ date: dateStr, count: activity[dateStr] || 0 });
      } else {
        week.push(null);
      }
    }
    weeks.push(week);
  }

  const getColor = (count) => {
    if (count === 0) return 'bg-[var(--bg-tertiary)]';
    if (count === 1) return 'bg-blue-200 dark:bg-blue-900';
    if (count === 2) return 'bg-blue-300 dark:bg-blue-700';
    if (count <= 4) return 'bg-blue-400 dark:bg-blue-600';
    return 'bg-blue-600 dark:bg-blue-400';
  };

  const totalContributions = Object.values(activity).reduce((a, b) => a + b, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Activity</h3>
        <span className="text-xs text-[var(--text-secondary)]">{totalContributions} contributions in the last year</span>
      </div>
      <div className="overflow-x-auto">
        <div className="flex gap-[2px] min-w-[680px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[2px]">
              {week.map((day, di) => (
                day ? (
                  <div
                    key={di}
                    className={`w-[10px] h-[10px] rounded-[2px] ${getColor(day.count)} transition-colors`}
                    title={`${day.date}: ${day.count} contribution${day.count !== 1 ? 's' : ''}`}
                  />
                ) : (
                  <div key={di} className="w-[10px] h-[10px]" />
                )
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1 mt-2 justify-end">
        <span className="text-[10px] text-[var(--text-tertiary)]">Less</span>
        <div className="w-[10px] h-[10px] rounded-[2px] bg-[var(--bg-tertiary)]" />
        <div className="w-[10px] h-[10px] rounded-[2px] bg-blue-200 dark:bg-blue-900" />
        <div className="w-[10px] h-[10px] rounded-[2px] bg-blue-300 dark:bg-blue-700" />
        <div className="w-[10px] h-[10px] rounded-[2px] bg-blue-400 dark:bg-blue-600" />
        <div className="w-[10px] h-[10px] rounded-[2px] bg-blue-600 dark:bg-blue-400" />
        <span className="text-[10px] text-[var(--text-tertiary)]">More</span>
      </div>
    </div>
  );
};

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [activeTab, setActiveTab] = useState('questions');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, [id]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const [userRes, questionsRes, answersRes] = await Promise.all([
        getUser(id),
        getUserQuestions(id),
        getUserAnswers(id)
      ]);

      setUser(userRes.data);
      setQuestions(questionsRes.data.questions);
      setAnswers(answersRes.data.answers);
    } catch (error) {
      toast.error('Failed to load user data');
      console.error('Failed to load user data', error);
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

  if (!user) {
    return (
      <div className="min-h-screen bg-pattern flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card text-center max-w-md"
        >
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-3xl font-bold mb-4 text-[var(--text-primary)]">User Not Found</h2>
          <p className="text-[var(--text-secondary)] mb-6">
            This user doesn't exist
          </p>
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
            >
              Back to Home
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pattern py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-6 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white"
        >
          <div className="flex items-center gap-6">
            {user.avatar ? (
              <motion.img
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                src={user.avatar}
                alt={user.username}
                className="avatar-lg border-4 border-white"
              />
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                className="avatar-lg border-4 border-white bg-white text-[var(--color-primary)] flex items-center justify-center text-4xl font-bold"
              >
                {user.username.charAt(0).toUpperCase()}
              </motion.div>
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{user.username}</h1>
              <div className="flex items-center gap-6 text-lg">
                <div>
                  <span className="opacity-80">Reputation:</span>{' '}
                  <span className="font-bold text-[var(--color-accent)]">{user.reputation}</span>
                </div>
                <div className="opacity-80">
                  Member since {new Date(user.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>
            <div>
              <FriendButton userId={user._id} username={user.username} />
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          <div className="card text-center">
            <div className="text-4xl font-bold text-[var(--color-primary)] mb-2">
              {questions.length}
            </div>
            <div className="text-gray-600 uppercase tracking-wide">Questions</div>
          </div>
          <div className="card text-center">
            <div className="text-4xl font-bold text-[var(--color-secondary)] mb-2">
              {answers.length}
            </div>
            <div className="text-gray-600 uppercase tracking-wide">Answers</div>
          </div>
          <div className="card text-center">
            <div className="text-4xl font-bold text-[var(--color-accent)] mb-2">
              {user.reputation}
            </div>
            <div className="text-gray-600 uppercase tracking-wide">Reputation</div>
          </div>
        </motion.div>

        {/* Badges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card mb-6"
        >
          <UserBadges userId={id} />
        </motion.div>

        {/* Activity Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="card mb-6"
        >
          <ActivityHeatmap userId={id} />
        </motion.div>

        {/* Activity Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex border-b-2 border-[var(--border-primary)] mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('questions')}
              className={`px-6 py-3 font-bold uppercase tracking-wide transition-all ${
                activeTab === 'questions'
                  ? 'text-[var(--color-primary)] border-b-4 border-[var(--color-primary)] -mb-0.5'
                  : 'text-[var(--text-secondary)] hover:text-[var(--color-primary)]'
              }`}
            >
              Questions ({questions.length})
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('answers')}
              className={`px-6 py-3 font-bold uppercase tracking-wide transition-all ${
                activeTab === 'answers'
                  ? 'text-[var(--color-primary)] border-b-4 border-[var(--color-primary)] -mb-0.5'
                  : 'text-[var(--text-secondary)] hover:text-[var(--color-primary)]'
              }`}
            >
              Answers ({answers.length})
            </motion.button>
          </div>

          <div>
            {activeTab === 'questions' ? (
              questions.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-[var(--text-secondary)] text-lg">No questions yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <QuestionCard key={question._id} question={question} index={index} />
                  ))}
                </div>
              )
            ) : (
              answers.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">💬</div>
                  <p className="text-[var(--text-secondary)] text-lg">No answers yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {answers.map((answer, index) => (
                    <motion.div
                      key={answer._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="card"
                    >
                      <div className="mb-3">
                        <Link
                          to={`/questions/${answer.question._id}`}
                          className="text-lg font-bold text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors"
                        >
                          {answer.question.title}
                        </Link>
                      </div>
                      <div className="text-[var(--text-secondary)] line-clamp-3 mb-3">
                        {answer.body.substring(0, 200)}...
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[var(--text-tertiary)]">
                        <span className="font-semibold text-[var(--color-primary)]">
                          {answer.votes} votes
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(answer.createdAt).toLocaleDateString()}
                        </span>
                        {answer.isAccepted && (
                          <>
                            <span>•</span>
                            <span className="text-green-600 font-semibold">✓ Accepted</span>
                          </>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;

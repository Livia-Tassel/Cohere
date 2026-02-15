import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getQuestion, getAnswers, createAnswer, deleteAnswer, updateAnswer, acceptAnswer, deleteQuestion } from '../services/api';
import { useAuth } from '../context/AuthContext';
import AnswerCard from '../components/AnswerCard';
import VoteButtons from '../components/VoteButtons';
import RichTextEditor from '../components/RichTextEditor';
import RelatedQuestions from '../components/RelatedQuestions';
import BookmarkButton from '../components/BookmarkButton';
import CommentList from '../components/CommentList';
import QuestionStats from '../components/QuestionStats';
import TopContributors from '../components/TopContributors';
import AskQuestionWidget from '../components/AskQuestionWidget';
import PopularTags from '../components/PopularTags';
import HelpfulTips from '../components/HelpfulTips';
import CommunityStats from '../components/CommunityStats';
import TagList from '../components/TagList';
import toast, { Toaster } from 'react-hot-toast';
import { highlightAllCode } from '../utils/highlightCode';

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [answerBody, setAnswerBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const questionBodyRef = useRef(null);

  useEffect(() => {
    loadQuestion();
    loadAnswers();
  }, [id]);

  // Apply syntax highlighting after content loads
  useEffect(() => {
    if (question && questionBodyRef.current) {
      highlightAllCode();
    }
  }, [question]);

  const loadQuestion = async () => {
    try {
      const response = await getQuestion(id);
      setQuestion(response.data);
    } catch (error) {
      toast.error('Failed to load question');
    } finally {
      setLoading(false);
    }
  };

  const loadAnswers = async () => {
    try {
      const response = await getAnswers(id);
      setAnswers(response.data);
    } catch (error) {
      console.error('Failed to load answers', error);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to answer');
      return;
    }

    if (answerBody.length < 10) {
      toast.error('Answer must be at least 10 characters');
      return;
    }

    setSubmitting(true);
    try {
      await createAnswer({ body: answerBody, questionId: id });
      setAnswerBody('');
      loadAnswers();
      loadQuestion();
      toast.success('Answer posted!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post answer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    try {
      await deleteAnswer(answerId);
      loadAnswers();
      loadQuestion();
      toast.success('Answer deleted');
    } catch (error) {
      toast.error('Failed to delete answer');
    }
  };

  const handleEditAnswer = async (answerId, body) => {
    try {
      await updateAnswer(answerId, { body });
      loadAnswers();
    } catch (error) {
      throw error;
    }
  };

  const handleAcceptAnswer = async (answerId) => {
    try {
      await acceptAnswer(id, answerId);
      loadAnswers();
      loadQuestion();
      toast.success('Answer accepted!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept answer');
    }
  };

  const handleDeleteQuestion = async () => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;

    try {
      await deleteQuestion(id);
      toast.success('Question deleted');
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete question');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pattern flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-pattern flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card text-center max-w-md"
        >
          <div className="text-6xl mb-4">❓</div>
          <h2 className="text-3xl font-bold mb-4 text-[var(--text-primary)]">Question Not Found</h2>
          <p className="text-[var(--text-secondary)] mb-6">
            This question doesn't exist or has been deleted
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

  const isQuestionAuthor = user && user.id === question.author._id;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-[var(--space-3)]">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[var(--space-3)]">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Question */}
            <div className="card mb-[var(--space-3)]">
              <div className="flex gap-[var(--space-4)]">
                <VoteButtons
                  targetType="question"
                  targetId={question._id}
                  initialVotes={question.votes}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-[var(--space-2)] mb-[var(--space-2)]">
                    <h1 className="text-2xl font-semibold text-[var(--text-primary)] flex-1">{question.title}</h1>
                    <BookmarkButton questionId={question._id} size="md" />
                  </div>

              <div className="flex flex-wrap gap-[var(--space-2)] text-xs text-[var(--text-tertiary)] mb-[var(--space-3)]">
                <span>Asked {formatDate(question.createdAt)}</span>
                <span>•</span>
                <span>{question.views} views</span>
                <span>•</span>
                <span>{question.answerCount} answers</span>
              </div>

              <div
                ref={questionBodyRef}
                className="prose max-w-none mb-[var(--space-3)] text-sm"
                dangerouslySetInnerHTML={{ __html: question.body }}
              />

              <div className="flex flex-wrap gap-[var(--space-1)] mb-[var(--space-3)]">
                {question.tags.map((tag) => (
                  <Link key={tag} to={`/tags/${tag}`} className="tag">
                    {tag}
                  </Link>
                ))}
              </div>

              <div className="flex items-center justify-between pt-[var(--space-2)] border-t border-[var(--border-primary)]">
                <div className="flex gap-[var(--space-2)]">
                  {isQuestionAuthor && (
                    <>
                      <button
                        onClick={() => navigate(`/questions/${id}/edit`)}
                        className="text-xs font-medium text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors duration-[var(--transition-fast)]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDeleteQuestion}
                        className="text-xs font-medium text-[var(--text-secondary)] hover:text-red-600 transition-colors duration-[var(--transition-fast)]"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>

                <Link to={`/profile/${question.author._id}`} className="flex items-center gap-[var(--space-2)]">
                  {question.author.avatar ? (
                    <img src={question.author.avatar} alt={question.author.username} className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white text-xs font-bold">
                      {question.author.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-semibold text-[var(--text-primary)]">
                      {question.author.username}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)]">
                      {question.author.reputation} rep
                    </div>
                  </div>
                </Link>
              </div>

              {/* Question Comments */}
              <CommentList targetType="Question" targetId={question._id} />
                </div>
              </div>
            </div>

            {/* Answers */}
            <div className="mb-[var(--space-3)]">
              <h2 className="text-lg font-semibold mb-[var(--space-2)] text-[var(--text-primary)]">
                {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
              </h2>
              <div className="space-y-[var(--space-2)]">
                {answers.map((answer) => (
                  <AnswerCard
                    key={answer._id}
                    answer={answer}
                    onDelete={handleDeleteAnswer}
                    onEdit={handleEditAnswer}
                    onAccept={handleAcceptAnswer}
                    isQuestionAuthor={isQuestionAuthor}
                    isAccepted={answer._id === question.acceptedAnswer}
                  />
                ))}
              </div>
            </div>

            {/* Answer Form */}
            <div className="card">
              {user ? (
                <>
                  <h3 className="text-lg font-semibold mb-[var(--space-2)] text-[var(--text-primary)]">Your Answer</h3>
                  <form onSubmit={handleSubmitAnswer}>
                    <RichTextEditor
                      content={answerBody}
                      onChange={setAnswerBody}
                      placeholder="Write your answer here. Use the toolbar to format your text and add images..."
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={submitting}
                      className="mt-[var(--space-3)] btn-primary text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <div className="flex items-center justify-center">
                          <div className="spinner w-4 h-4 border-2"></div>
                          <span className="ml-2">Posting...</span>
                        </div>
                      ) : (
                        'Post Your Answer'
                      )}
                    </motion.button>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-[var(--space-2)]">🔒</div>
                  <h3 className="text-lg font-semibold mb-[var(--space-1)] text-[var(--text-primary)]">Login to Answer</h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-[var(--space-3)]">
                    You need to be logged in to post an answer
                  </p>
                  <Link to="/login">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-primary text-sm px-4 py-2"
                    >
                      Login
                    </motion.button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-[var(--space-3)]">
            <QuestionStats question={question} />
            <RelatedQuestions questionId={id} />
            <TopContributors />
            <PopularTags />
            <CommunityStats />
            <HelpfulTips />
            <AskQuestionWidget />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { getQuestion, getAnswers, createAnswer, deleteAnswer, updateAnswer, acceptAnswer, deleteQuestion } from '../services/api';
import { useAuth } from '../context/AuthContext';
import AnswerCard from '../components/AnswerCard';
import VoteButtons from '../components/VoteButtons';
import RichTextEditor from '../components/RichTextEditor';
import toast, { Toaster } from 'react-hot-toast';

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [answerBody, setAnswerBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadQuestion();
    loadAnswers();
  }, [id]);

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
          <h2 className="text-3xl font-bold mb-4">Question Not Found</h2>
          <p className="text-gray-600 mb-6">
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
    <div className="min-h-screen bg-pattern py-8">
      <Toaster position="top-right" />

      <div className="max-w-5xl mx-auto px-4">
        {/* Question */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-6"
        >
          <div className="flex gap-6">
            <VoteButtons
              targetType="question"
              targetId={question._id}
              initialVotes={question.votes}
            />

            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4">{question.title}</h1>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                <span>Asked {formatDate(question.createdAt)}</span>
                <span>•</span>
                <span>{question.views} views</span>
                <span>•</span>
                <span>{question.answerCount} answers</span>
              </div>

              <div className="prose max-w-none mb-6">
                <ReactMarkdown>{question.body}</ReactMarkdown>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {question.tags.map((tag) => (
                  <Link key={tag} to={`/tags/${tag}`}>
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className="badge badge-secondary"
                    >
                      {tag}
                    </motion.span>
                  </Link>
                ))}
              </div>

              <div className="flex items-center justify-between pt-6 border-t-2 border-gray-200">
                <div className="flex gap-3">
                  {isQuestionAuthor && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/questions/${id}/edit`)}
                        className="text-sm font-semibold text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors"
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDeleteQuestion}
                        className="text-sm font-semibold text-gray-600 hover:text-red-600 transition-colors"
                      >
                        Delete
                      </motion.button>
                    </>
                  )}
                </div>

                <Link to={`/profile/${question.author._id}`} className="flex items-center gap-3">
                  {question.author.avatar ? (
                    <img src={question.author.avatar} alt={question.author.username} className="avatar" />
                  ) : (
                    <div className="avatar bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-bold">
                      {question.author.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-[var(--color-dark)]">
                      {question.author.username}
                    </div>
                    <div className="text-sm text-gray-600">
                      {question.author.reputation} rep
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Answers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h2 className="text-3xl font-bold mb-6">
            {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
          </h2>
          <div className="space-y-4">
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
        </motion.div>

        {/* Answer Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          {user ? (
            <>
              <h3 className="text-2xl font-bold mb-6">Your Answer</h3>
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
                  className="mt-6 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center">
                      <div className="spinner w-5 h-5 border-2"></div>
                      <span className="ml-2">Posting...</span>
                    </div>
                  ) : (
                    'Post Your Answer'
                  )}
                </motion.button>
              </form>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold mb-4">Login to Answer</h3>
              <p className="text-gray-600 mb-6">
                You need to be logged in to post an answer
              </p>
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary"
                >
                  Login
                </motion.button>
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default QuestionDetail;

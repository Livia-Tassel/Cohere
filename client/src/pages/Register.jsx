import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      loginUser(response.data.token, response.data.user);
      toast.success('Welcome to DevQuery!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pattern flex items-center justify-center px-4 py-12">
      <Toaster position="top-right" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="card">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <span className="text-4xl font-bold text-white">Q</span>
          </motion.div>

          <h1 className="text-4xl font-bold text-center mb-2 text-[var(--text-primary)]">Join DevQuery</h1>
          <p className="text-center text-[var(--text-secondary)] mb-8">
            Start your developer journey today
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-wide text-[var(--text-primary)]">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-[var(--radius-lg)] focus:border-[var(--border-focus)] focus:outline-none focus:shadow-[0_0_0_3px_var(--glow-primary)] transition-all"
                minLength={3}
                maxLength={30}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-wide text-[var(--text-primary)]">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-[var(--radius-lg)] focus:border-[var(--border-focus)] focus:outline-none focus:shadow-[0_0_0_3px_var(--glow-primary)] transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-wide text-[var(--text-primary)]">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-[var(--radius-lg)] focus:border-[var(--border-focus)] focus:outline-none focus:shadow-[0_0_0_3px_var(--glow-primary)] transition-all"
                minLength={6}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-wide text-[var(--text-primary)]">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-[var(--radius-lg)] focus:border-[var(--border-focus)] focus:outline-none focus:shadow-[0_0_0_3px_var(--glow-primary)] transition-all"
                minLength={6}
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner w-5 h-5 border-2"></div>
                </div>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[var(--text-secondary)]">
              Already have an account?{' '}
              <Link to="/login" className="text-[var(--color-primary)] font-bold hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-20 right-10 w-20 h-20 bg-[var(--color-accent)] rounded-full opacity-20 blur-xl"
        />
        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-20 left-10 w-32 h-32 bg-[var(--color-primary)] rounded-full opacity-20 blur-xl"
        />
      </motion.div>
    </div>
  );
};

export default Register;

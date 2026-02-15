import { motion } from 'framer-motion';
import { useState } from 'react';

const ErrorBoundary = ({ children, fallback }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  if (hasError) {
    return fallback || (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card text-center py-16"
      >
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-2xl font-bold mb-2 text-[var(--text-primary)]">
          Something went wrong
        </h3>
        <p className="text-[var(--text-secondary)] mb-6">
          {error?.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={() => {
            setHasError(false);
            setError(null);
            window.location.reload();
          }}
          className="btn-primary"
        >
          Reload Page
        </button>
      </motion.div>
    );
  }

  return children;
};

const EmptyState = ({ icon = '📭', title, description, action }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card text-center py-16"
    >
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-2 text-[var(--text-primary)]">
        {title}
      </h3>
      <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
        {description}
      </p>
      {action && action}
    </motion.div>
  );
};

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">❌</span>
        <div className="flex-1">
          <h4 className="font-semibold text-red-800 dark:text-red-200 mb-1">
            Error
          </h4>
          <p className="text-sm text-red-700 dark:text-red-300">
            {message}
          </p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            Retry
          </button>
        )}
      </div>
    </motion.div>
  );
};

const SuccessMessage = ({ message, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="card bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">✅</span>
        <div className="flex-1">
          <h4 className="font-semibold text-green-800 dark:text-green-200 mb-1">
            Success
          </h4>
          <p className="text-sm text-green-700 dark:text-green-300">
            {message}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
          >
            ✕
          </button>
        )}
      </div>
    </motion.div>
  );
};

const InfoMessage = ({ message, icon = 'ℹ️' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {message}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export { ErrorBoundary, EmptyState, ErrorMessage, SuccessMessage, InfoMessage };

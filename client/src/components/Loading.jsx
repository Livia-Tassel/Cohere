import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <motion.div
        className={`${sizes[size]} border-[var(--border-primary)] border-t-[var(--color-primary)] rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-[var(--text-secondary)]"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

const LoadingDots = ({ text = 'Loading' }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center">
      <span className="text-[var(--text-secondary)] text-sm">
        {text}{dots}
      </span>
    </div>
  );
};

const LoadingBar = ({ progress = 0 }) => {
  return (
    <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-2 overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  );
};

const LoadingOverlay = ({ show, text = 'Loading...' }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="card p-8 text-center"
          >
            <LoadingSpinner size="lg" text={text} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const PulseLoader = ({ count = 3 }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="w-3 h-3 bg-[var(--color-primary)] rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  );
};

export { LoadingSpinner, LoadingDots, LoadingBar, LoadingOverlay, PulseLoader };

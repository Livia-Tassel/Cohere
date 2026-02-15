import { motion } from 'framer-motion';
import { useState } from 'react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Listen to scroll events
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', toggleVisibility);
  }

  return (
    <>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      )}
    </>
  );
};

const BackButton = ({ onClick, text = 'Back' }) => {
  return (
    <motion.button
      whileHover={{ x: -4 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      <span className="font-medium">{text}</span>
    </motion.button>
  );
};

const ShareButton = ({ url, title }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleShare}
      className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-[var(--radius-md)] text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-all"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
      {copied ? 'Copied!' : 'Share'}
    </motion.button>
  );
};

const CopyButton = ({ text, label = 'Copy' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-2 py-1 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-all"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {label}
        </>
      )}
    </motion.button>
  );
};

const LikeButton = ({ isLiked, onToggle, count }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-sm font-medium transition-all ${
        isLiked
          ? 'bg-red-500 text-white'
          : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] border border-[var(--border-primary)]'
      }`}
    >
      <motion.svg
        className="w-4 h-4"
        fill={isLiked ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
        animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </motion.svg>
      {count > 0 && <span>{count}</span>}
    </motion.button>
  );
};

export { ScrollToTop, BackButton, ShareButton, CopyButton, LikeButton };

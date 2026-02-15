import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getActiveFestival } from '../config/festivals';

const FestivalBanner = () => {
  const [festival, setFestival] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const activeFestival = getActiveFestival();
    if (activeFestival) {
      const dismissedKey = `dismissed-festival-${activeFestival.id}`;
      const isDismissed = localStorage.getItem(dismissedKey);

      if (!isDismissed) {
        setFestival(activeFestival);
        setIsVisible(true);
      }
    }
  }, []);

  const handleDismiss = () => {
    if (festival) {
      localStorage.setItem(`dismissed-festival-${festival.id}`, 'true');
      setIsVisible(false);
    }
  };

  if (!festival) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="overflow-hidden"
        >
          <div className={`relative bg-gradient-to-r ${festival.bgGradient}`}>
            {/* Decorative overlay */}
            <div className="absolute inset-0 bg-black/5"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[var(--space-2)]">
              <div className="flex items-center justify-between gap-[var(--space-3)]">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="flex items-center gap-[var(--space-2)] flex-1 min-w-0"
                >
                  <motion.span
                    animate={{
                      rotate: [0, 10, -10, 10, 0],
                      scale: [1, 1.1, 1, 1.1, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: "easeInOut"
                    }}
                    className="text-3xl flex-shrink-0"
                  >
                    {festival.emoji}
                  </motion.span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-base sm:text-lg font-display leading-tight">
                      {festival.title}
                    </h3>
                    <p className="text-white/90 text-xs sm:text-sm mt-0.5">
                      {festival.message}
                    </p>
                  </div>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDismiss}
                  className="flex-shrink-0 p-2 rounded-[var(--radius-lg)] bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-[var(--transition-fast)]"
                  aria-label="Dismiss banner"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FestivalBanner;

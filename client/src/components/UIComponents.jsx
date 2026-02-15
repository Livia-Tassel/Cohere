import { motion } from 'framer-motion';
import { useState } from 'react';

const Tooltip = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`absolute ${positions[position]} z-50 px-2 py-1 bg-[var(--text-primary)] text-[var(--text-inverse)] text-xs rounded whitespace-nowrap pointer-events-none`}
        >
          {content}
          <div className={`absolute w-2 h-2 bg-[var(--text-primary)] transform rotate-45 ${
            position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' :
            position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' :
            position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' :
            'left-[-4px] top-1/2 -translate-y-1/2'
          }`}></div>
        </motion.div>
      )}
    </div>
  );
};

const Badge = ({ children, variant = 'default', size = 'md' }) => {
  const variants = {
    default: 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]',
    primary: 'bg-[var(--color-primary)] text-white',
    secondary: 'bg-[var(--color-secondary)] text-white',
    success: 'bg-[var(--color-success)] text-white',
    warning: 'bg-[var(--color-warning)] text-white',
    error: 'bg-[var(--color-error)] text-white'
  };

  const sizes = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};

const Divider = ({ text, className = '' }) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex-1 h-px bg-[var(--border-primary)]"></div>
      {text && (
        <span className="text-sm text-[var(--text-tertiary)] font-medium">
          {text}
        </span>
      )}
      <div className="flex-1 h-px bg-[var(--border-primary)]"></div>
    </div>
  );
};

const ProgressBar = ({ value, max = 100, showLabel = true, color = 'primary' }) => {
  const percentage = Math.min((value / max) * 100, 100);

  const colors = {
    primary: 'bg-[var(--color-primary)]',
    secondary: 'bg-[var(--color-secondary)]',
    success: 'bg-[var(--color-success)]',
    warning: 'bg-[var(--color-warning)]',
    error: 'bg-[var(--color-error)]'
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-[var(--text-secondary)]">Progress</span>
          <span className="text-xs font-medium text-[var(--text-primary)]">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${colors[color]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

const Avatar = ({ src, alt, size = 'md', status }) => {
  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    busy: 'bg-red-500',
    away: 'bg-yellow-500'
  };

  return (
    <div className="relative inline-block">
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`${sizes[size]} rounded-full object-cover border-2 border-[var(--border-primary)]`}
        />
      ) : (
        <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-bold border-2 border-[var(--border-primary)]`}>
          {alt?.charAt(0).toUpperCase()}
        </div>
      )}
      {status && (
        <span className={`absolute bottom-0 right-0 w-3 h-3 ${statusColors[status]} rounded-full border-2 border-[var(--bg-primary)]`}></span>
      )}
    </div>
  );
};

const AvatarGroup = ({ avatars, max = 3, size = 'md' }) => {
  const displayAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className="flex -space-x-2">
      {displayAvatars.map((avatar, index) => (
        <div key={index} className="relative" style={{ zIndex: displayAvatars.length - index }}>
          <Avatar {...avatar} size={size} />
        </div>
      ))}
      {remaining > 0 && (
        <div className={`${size === 'sm' ? 'w-8 h-8 text-xs' : size === 'md' ? 'w-10 h-10 text-sm' : 'w-12 h-12 text-base'} rounded-full bg-[var(--bg-tertiary)] border-2 border-[var(--bg-primary)] flex items-center justify-center text-[var(--text-secondary)] font-medium`}>
          +{remaining}
        </div>
      )}
    </div>
  );
};

const Chip = ({ label, onDelete, icon, color = 'default' }) => {
  const colors = {
    default: 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]',
    primary: 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]',
    secondary: 'bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] border-[var(--color-secondary)]',
    success: 'bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]'
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${colors[color]} transition-all`}
    >
      {icon && <span className="text-sm">{icon}</span>}
      <span>{label}</span>
      {onDelete && (
        <button
          onClick={onDelete}
          className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </motion.div>
  );
};

export { Tooltip, Badge, Divider, ProgressBar, Avatar, AvatarGroup, Chip };

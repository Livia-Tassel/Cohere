import { motion } from 'framer-motion';

const SkeletonCard = () => {
  return (
    <div className="card animate-pulse">
      <div className="flex gap-4">
        {/* Stats skeleton */}
        <div className="flex flex-col gap-2 min-w-[60px]">
          <div className="h-8 bg-[var(--bg-tertiary)] rounded"></div>
          <div className="h-8 bg-[var(--bg-tertiary)] rounded"></div>
          <div className="h-8 bg-[var(--bg-tertiary)] rounded"></div>
        </div>

        {/* Content skeleton */}
        <div className="flex-1">
          <div className="h-6 bg-[var(--bg-tertiary)] rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-[var(--bg-tertiary)] rounded w-full mb-2"></div>
          <div className="h-4 bg-[var(--bg-tertiary)] rounded w-5/6 mb-3"></div>

          {/* Tags skeleton */}
          <div className="flex gap-2 mb-3">
            <div className="h-6 w-16 bg-[var(--bg-tertiary)] rounded"></div>
            <div className="h-6 w-20 bg-[var(--bg-tertiary)] rounded"></div>
            <div className="h-6 w-14 bg-[var(--bg-tertiary)] rounded"></div>
          </div>

          {/* Meta skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-[var(--bg-tertiary)] rounded-full"></div>
            <div className="h-4 w-24 bg-[var(--bg-tertiary)] rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SkeletonSidebar = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="card animate-pulse">
          <div className="h-5 bg-[var(--bg-tertiary)] rounded w-1/2 mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-[var(--bg-tertiary)] rounded"></div>
            <div className="h-4 bg-[var(--bg-tertiary)] rounded w-5/6"></div>
            <div className="h-4 bg-[var(--bg-tertiary)] rounded w-4/6"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const SkeletonList = ({ count = 5 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

const SkeletonProfile = () => {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="card animate-pulse">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-[var(--bg-tertiary)] rounded-full"></div>
          <div className="flex-1">
            <div className="h-8 bg-[var(--bg-tertiary)] rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-[var(--bg-tertiary)] rounded w-1/2"></div>
          </div>
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-10 bg-[var(--bg-tertiary)] rounded mb-2"></div>
            <div className="h-4 bg-[var(--bg-tertiary)] rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { SkeletonCard, SkeletonSidebar, SkeletonList, SkeletonProfile };

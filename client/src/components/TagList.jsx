import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const TagList = ({ tags }) => {
  return (
    <div className="bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)] p-4">
      <h3 className="text-sm font-semibold mb-3 text-[var(--text-primary)]">Popular Tags</h3>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <Link
            key={tag.name}
            to={`/tags/${tag.name}`}
            className="inline-flex items-center gap-1.5 px-2 py-1 bg-[var(--bg-tertiary)] hover:bg-[var(--color-primary)] hover:text-white text-[var(--color-primary)] text-xs font-medium rounded border border-[var(--color-primary)] transition-colors"
          >
            <span>{tag.name}</span>
            <span className="text-[10px] opacity-70">×{tag.count}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TagList;

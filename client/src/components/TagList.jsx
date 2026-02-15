import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const TagList = ({ tags }) => {
  return (
    <div className="card">
      <h3 className="text-sm font-semibold mb-3 text-[var(--text-primary)]">Popular Tags</h3>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <Link
            key={tag.name}
            to={`/tags/${tag.name}`}
            className="tag"
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

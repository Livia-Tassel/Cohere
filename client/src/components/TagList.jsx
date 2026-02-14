import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const TagList = ({ tags }) => {
  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <h3 className="text-xl font-bold mb-5">Popular Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <motion.div
            key={tag.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              to={`/tags/${tag.name}`}
              className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] text-white rounded-full hover:shadow-lg transition-all text-sm font-semibold"
            >
              <span>{tag.name}</span>
              <span className="text-xs opacity-80">×{tag.count}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TagList;

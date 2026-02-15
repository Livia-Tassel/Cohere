import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-ruby';

/**
 * Apply syntax highlighting to all code blocks in the DOM
 */
export const highlightAllCode = () => {
  if (typeof window !== 'undefined') {
    Prism.highlightAll();
  }
};

/**
 * Apply syntax highlighting to a specific element
 */
export const highlightElement = (element) => {
  if (element && typeof window !== 'undefined') {
    Prism.highlightAllUnder(element);
  }
};

export default Prism;

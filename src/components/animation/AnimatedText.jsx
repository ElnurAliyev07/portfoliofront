import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * AnimatedText Component
 * 
 * A modern, accessible text animation component that animates words individually
 * with smooth spring physics and staggered timing effects.
 * 
 * Features:
 * - Staggered word animations with spring physics
 * - Accessible with proper ARIA labels
 * - Customizable styling and animation timing
 * - Responsive design with flexible layout
 * 
 * @param {string} text - The text content to animate
 * @param {string} className - Additional CSS classes for styling
 * @param {number} staggerDelay - Delay between word animations (default: 0.1s)
 * @param {number} initialDelay - Initial delay before animation starts (default: 0.03s)
 */
const AnimatedText = ({ 
  text, 
  className = '', 
  staggerDelay = 0.1, 
  initialDelay = 0.03 
}) => {
  // Split text into individual words for animation
  const words = text.split(' ');

  // Animation configuration for the container
  const containerVariants = {
    hidden: { 
      opacity: 0 
    },
    visible: (customDelay = 1) => ({
      opacity: 1,
      transition: { 
        staggerChildren: staggerDelay,
        delayChildren: initialDelay * customDelay,
        ease: 'easeOut'
      },
    }),
  };

  // Animation configuration for individual words
  const wordVariants = {
    hidden: {
      opacity: 0,
      x: 20,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
        ease: 'easeIn',
      },
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
        ease: 'easeOut',
      },
    },
  };

  // Inline styles for the container
  const containerStyles = {
    overflow: 'hidden',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '0.25rem'
  };

  return (
    <motion.div
      // Accessibility attributes
      aria-label={text}
      role="heading"
      // Styling
      style={containerStyles}
      className={`animated-text-container ${className}`}
      // Animation props
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      // Performance optimization
      layout
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          variants={wordVariants}
          className="animated-word"
          style={{ 
            display: 'inline-block',
            whiteSpace: 'nowrap'
          }}
          // Add slight delay variation for more natural feel
          custom={index}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

// PropTypes for type checking and documentation
AnimatedText.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
  staggerDelay: PropTypes.number,
  initialDelay: PropTypes.number,
};

// Default props
AnimatedText.defaultProps = {
  className: '',
  staggerDelay: 0.1,
  initialDelay: 0.03,
};

export default AnimatedText;
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState, memo, useCallback, useMemo } from 'react';

// Simplified animation variants
const containerVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

// Stats data - memoized to prevent re-creation
const STATS_DATA = [
  { 
    value: 2025, 
    label: 'Graduated', 
    suffix: '', 
    color: 'from-indigo-500 to-purple-500',
    icon: '🎓',
    description: 'Information Security Degree'
  },
  { 
    value: 15, 
    label: 'Tech Stack',
    suffix: '+', 
    color: 'from-blue-500 to-cyan-500',
    icon: '⚡',
    description: 'Languages& Frameworks'
  },
  { 
    value: 10, 
    label: (
  <>
    ML <br />
    Projects
  </>
),
    suffix: '+', 
    color: 'from-green-500 to-emerald-500',
    icon: '🤖',
    description: (
  <>
    AI/ML <br />
    Applications
  </>
)

  },
  { 
    value: 2, 
    label: 'Year Experience', 
    suffix: '', 
    color: 'from-orange-500 to-red-500',
    icon: '🚀',
    description: 'Professional Development'
  },
];

// Optimized counter hook - reduced animation calls
const useCounter = (endValue, duration = 1500, shouldStart = false) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!shouldStart) return;
    
    // Special case for year 2025
    if (endValue === 2025) {
      setCount(2025);
      return;
    }

    // Use a simpler approach with fewer animation frames
    let startTime = null;
    let animationFrame;
    const startValue = 0;
    
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Simplified easing
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOut);
      
      setCount(currentValue);
      
      if (progress < 1) {
        // Throttle animation frames for better performance
        setTimeout(() => {
          animationFrame = requestAnimationFrame(animate);
        }, 16); // ~60fps max
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [endValue, duration, shouldStart]);
  
  return count;
};

// Memoized StatCard component
const StatCard = memo(({ stat, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    threshold: 0.2,
    margin: "0px 0px -50px 0px" // Trigger earlier
  });
  const count = useCounter(stat.value, 1500, isInView);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);
  
  // Memoize gradient ID to prevent re-creation
  const gradientId = useMemo(() => `gradient-${index}`, [index]);
  
  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      whileHover={{ 
        scale: 1.02, // Reduced scale
        y: -2,
        transition: { duration: 0.2 }
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative"
    >
      {/* Simplified background glow */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${stat.color} rounded-xl blur opacity-15 group-hover:opacity-25 transition-opacity duration-300`} />
      
      {/* Main Card - reduced backdrop effects */}
      <div className="relative text-center p-6 rounded-xl bg-white/90 dark:bg-gray-900/90 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-500/20 dark:hover:border-blue-400/20 transition-colors duration-300">
        {/* Icon - simplified animation */}
        <motion.div
          className="text-3xl mb-3"
          animate={{ 
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          {stat.icon}
        </motion.div>
        
        {/* Counter */}
        <div className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
          <motion.div 
            className="text-3xl md:text-[1.725rem] font-bold"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            {count}
            {stat.suffix}
          </motion.div>
        </div>
        
        {/* Label */}
        <div className="space-y-1">
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 text-center">
            {stat.label}
          </div>
          <div
            className={`text-xs text-gray-600 dark:text-gray-400 transition-opacity duration-200 ${
              isHovered ? 'opacity-100' : 'opacity-70'
            }`}
          >
            {stat.description}
          </div>
        </div>
        
        {/* Simplified progress ring */}
        <div className="absolute top-2 right-2 w-8 h-8">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 32 32">
            <circle
              cx="16"
              cy="16"
              r="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.1"
            />
            <motion.circle
              cx="16"
              cy="16"
              r="12"
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="75.4"
              initial={{ strokeDashoffset: 75.4 }}
              animate={{ strokeDashoffset: isInView ? 0 : 75.4 }}
              transition={{ duration: 1, delay: index * 0.1 }}
            />
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </motion.div>
  );
});

const SectionHeader = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    viewport={{ once: true }}
    className="text-center mb-12"
  >
    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-black dark:text-white">
      Professional Milestones
    </h3>
    <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
      Key achievements and metrics that define my journey in technology and development
    </p>
  </motion.div>
));

// Main Component
const StatsCounter = () => {
  // Memoize the stats data to prevent re-creation
  const statsData = useMemo(() => STATS_DATA, []);

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-50/50 to-transparent dark:from-gray-800/10 dark:to-transparent rounded-2xl">
      <div className="max-w-6xl mx-auto">
        <SectionHeader />
        
        <motion.div
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {statsData.map((stat, index) => (
            <StatCard 
              key={stat.label} 
              stat={stat} 
              index={index}
            />
          ))}
        </motion.div>
        
        {/* Simplified additional info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500/10 to-pink-500/10 border border-indigo-500/20">
            <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
              🌟 Growing every day with new challenges
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Add display names for better debugging
StatCard.displayName = 'StatCard';
SectionHeader.displayName = 'SectionHeader';

export default memo(StatsCounter);
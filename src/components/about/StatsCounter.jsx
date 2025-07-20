import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

// Animation variants
const containerVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

// Stats data with enhanced information
const STATS_DATA = [
  { 
    value: 2025, 
    label: 'Graduated', 
    suffix: '', 
    color: 'from-indigo-500 to-purple-500',  // uyğun və zərif keçid
    icon: '🎓',
    description: 'Information Security Degree'
  },
  { 
    value: 15, 
    label: 'Tech Stack',
    suffix: '+', 
    color: 'from-blue-500 to-cyan-500',
    icon: '⚡',
    description: 'Languages & Frameworks'
  },
  { 
    value: 10, 
    label: 'ML Projects', 
    suffix: '+', 
    color: 'from-green-500 to-emerald-500',
    icon: '🤖',
    description: 'AI/ML Applications'
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

// Custom hook for counter animation
const useCounter = (endValue, duration = 2000, shouldStart = false) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!shouldStart) return;
    
    // Special case for year 2024
    if (endValue === 2025) {
      setCount(2025);
      return;
    }

    let startTime = null;
    const startValue = 0;
    
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Use easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);
      
      setCount(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [endValue, duration, shouldStart]);
  
  return count;
};

// Components
const StatCard = ({ stat, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });
  const count = useCounter(stat.value, 2000, isInView);
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      whileHover={{ 
        scale: 1.05,
        y: -5,
        transition: { duration: 0.3 }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Background Glow */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${stat.color} rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
      
      {/* Main Card */}
      <div className="relative text-center p-6 rounded-xl bg-[var(--background)]/80 backdrop-blur-sm border border-[var(--border)]/50 hover:border-[var(--primary)]/30 transition-all duration-500">
        {/* Icon */}
        <motion.div
          className="text-3xl mb-3"
          animate={{ 
            scale: isHovered ? 1.2 : 1,
            rotate: isHovered ? 5 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          {stat.icon}
        </motion.div>
        
        {/* Counter */}
        <div className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
          <motion.div 
            className="text-3xl md:text-[1.725rem] font-bold"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {count}
            {stat.suffix}
          </motion.div>
        </div>
        
        {/* Label */}
        <div className="space-y-1">
          <div className="text-sm font-semibold text-[var(--foreground)] text-center">
            {stat.label}
          </div>
          <motion.div
            className="text-xs text-[var(--muted-foreground)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0.7 }}
            transition={{ duration: 0.3 }}
          >
            {stat.description}
          </motion.div>
        </div>
        
        {/* Progress Ring (decorative) */}
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
              stroke="url(#gradient-${index})"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="75.4"
              initial={{ strokeDashoffset: 75.4 }}
              animate={{ strokeDashoffset: isInView ? 0 : 75.4 }}
              transition={{ duration: 1.5, delay: index * 0.2 }}
            />
            <defs>
              <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

const SectionHeader = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
    className="text-center mb-12"
  >
    <h3
      className="text-2xl md:text-3xl font-bold mb-4"
      style={{ color: '#000000' }}
    >
      Professional Milestones
    </h3>
    <p className="text-[var(--muted-foreground)] max-w-xl mx-auto">
      Key achievements and metrics that define my journey in technology and development
    </p>
  </motion.div>
);

// Main Component
const StatsCounter = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-[var(--muted)]/10 via-transparent to-[var(--muted)]/5 rounded-2xl">
      <div className="max-w-6xl mx-auto">
        <SectionHeader />
        
        <motion.div
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {STATS_DATA.map((stat, index) => (
            <StatCard 
              key={stat.label} 
              stat={stat} 
              index={index}
            />
          ))}
        </motion.div>
        
        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500/10 to-pink-500/10 border border-indigo-500/20">
            <span className="text-sm text-indigo-500 font-medium">
              🌟 Growing every day with new challenges
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsCounter;
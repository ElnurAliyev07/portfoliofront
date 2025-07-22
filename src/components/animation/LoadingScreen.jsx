import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/**
 * LoadingScreen Component - Optimized Version
 * 
 * A modern loading screen with animated progress bar, rotating logo,
 * and background particle effects. Optimized for performance and mobile devices.
 * 
 * Performance improvements:
 * - React.memo for preventing unnecessary re-renders
 * - useMemo for caching expensive computations (stars, animation variants)
 * - useCallback for stable function references
 * - useReducedMotion for accessibility
 * - Reduced particle count for mobile performance
 * - Optimized interval timing and cleanup
 * 
 * Mobile optimizations:
 * - Responsive typography and spacing
 * - Touch-friendly design
 * - Optimized particle effects for mobile devices
 * - Flexible layout that adapts to screen size
 * 
 * @param {Function} onComplete - Callback function when loading is complete
 */
const LoadingScreen = React.memo(({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');
  const [isComplete, setIsComplete] = useState(false);
  
  // Check if user prefers reduced motion for accessibility
  const prefersReducedMotion = useReducedMotion();

  // Memoize loading steps to prevent recreation on each render
  const loadingSteps = useMemo(() => [
    { text: 'Initializing...', duration: 300 },
    { text: 'Loading assets...', duration: 500 },
    { text: 'Preparing experience...', duration: 400 },
    { text: 'Almost ready...', duration: 300 }
  ], []);

  // Memoize star positions and properties to prevent recalculation
  // Reduced count for better mobile performance
  const stars = useMemo(() => 
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2
    })), []
  );

  // Memoized completion handler to prevent recreation
  const handleComplete = useCallback(() => {
    setIsComplete(true);
    // Short delay before calling onComplete for smooth transition
    setTimeout(() => onComplete?.(), 400);
  }, [onComplete]);

  // Memoize animation variants for better performance
  const containerExitVariant = useMemo(() => ({
    opacity: 0,
    scale: prefersReducedMotion ? 1 : 0.95,
    transition: { duration: 0.6, ease: "easeInOut" }
  }), [prefersReducedMotion]);

  const logoAnimations = useMemo(() => ({
    rotate: prefersReducedMotion ? {} : [0, 360],
    scale: prefersReducedMotion ? {} : [1, 1.05, 1],
  }), [prefersReducedMotion]);

  const logoTransitions = useMemo(() => ({
    rotate: { duration: 4, repeat: Infinity, ease: "linear" },
    scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
  }), []);

  // Progress simulation effect
  useEffect(() => {
    // Skip complex animation for users who prefer reduced motion
    if (prefersReducedMotion) {
      setTimeout(() => handleComplete(), 1500);
      return;
    }

    let currentStep = 0;
    let currentProgress = 0;
    let animationFrame;

    const updateProgress = () => {
      currentProgress += Math.random() * 12 + 3; // Slightly faster progress
      if (currentProgress > 100) currentProgress = 100;
      
      setProgress(currentProgress);
      
      // Update loading text based on progress
      if (currentStep < loadingSteps.length) {
        const stepProgress = ((currentStep + 1) / loadingSteps.length) * 100;
        if (currentProgress >= stepProgress && currentStep < loadingSteps.length) {
          setLoadingText(loadingSteps[currentStep].text);
          currentStep++;
        }
      }
      
      // Complete loading when progress reaches 100%
      if (currentProgress >= 100) {
        handleComplete();
        return;
      }

      // Schedule next update
      animationFrame = requestAnimationFrame(() => {
        setTimeout(updateProgress, 80); // Optimized timing
      });
    };

    // Start the progress simulation
    updateProgress();

    // Cleanup function
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [loadingSteps, handleComplete, prefersReducedMotion]);

  return (
    <AnimatePresence mode="wait">
      {!isComplete && (
        <motion.div
          className="
            fixed inset-0 
            bg-gradient-to-br from-slate-900 via-purple-900/90 to-slate-900 
            z-50 
            flex items-center justify-center 
            overflow-hidden
          "
          initial={{ opacity: 1, scale: 1 }}
          exit={containerExitVariant}
        >
          {/* Optimized Background Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {stars.map(({ id, left, top, delay, duration }) => (
              <motion.div
                key={id}
                className="
                  absolute 
                  w-0.5 h-0.5 
                  sm:w-1 sm:h-1 
                  bg-white/20 
                  rounded-full
                "
                style={{ 
                  left: `${left}%`, 
                  top: `${top}%`,
                  willChange: prefersReducedMotion ? 'auto' : 'transform, opacity'
                }}
                animate={prefersReducedMotion ? {} : {
                  opacity: [0.2, 0.6, 0.2],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration,
                  repeat: Infinity,
                  delay,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Main Content Container */}
          <div className="
            relative z-10 
            text-center 
            w-full max-w-xs 
            sm:max-w-sm 
            mx-auto 
            px-4 
            sm:px-6
          ">
            {/* Logo and Title Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-6 sm:mb-8"
            >
              {/* Animated Logo */}
              <motion.div
                className="
                  w-12 h-12 
                  sm:w-16 sm:h-16 
                  md:w-20 md:h-20 
                  mx-auto 
                  mb-4 sm:mb-6 
                  rounded-full 
                  bg-gradient-to-r from-purple-400 to-blue-400 
                  flex items-center justify-center 
                  shadow-xl
                  transform-gpu
                "
                animate={logoAnimations}
                transition={logoTransitions}
                style={{ willChange: prefersReducedMotion ? 'auto' : 'transform' }}
              >
                <span className="
                  text-sm sm:text-lg md:text-xl 
                  font-bold text-white 
                  select-none
                ">
                  EA
                </span>
              </motion.div>
              
              {/* Title */}
              <h2 className="
                text-lg 
                sm:text-2xl 
                md:text-3xl 
                lg:text-4xl 
                font-bold 
                bg-gradient-to-r from-white via-purple-200 to-blue-200 
                bg-clip-text text-transparent 
                mb-2 sm:mb-4 
                leading-tight
              ">
                Elnur Aliyev
              </h2>
              
              {/* Subtitle */}
              <p className="
                text-white/70 
                text-xs 
                sm:text-sm 
                md:text-base 
                leading-relaxed
                px-2
              ">
                AI/ML Engineer & Python Full-Stack Developer
              </p>
            </motion.div>

            {/* Progress Bar Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mb-6"
            >
              {/* Progress Bar Container */}
              <div className="
                w-full 
                bg-white/10 
                rounded-full 
                h-1.5 sm:h-2 
                mb-3 sm:mb-4 
                overflow-hidden 
                backdrop-blur-sm
                border border-white/5
              ">
                {/* Progress Bar Fill */}
                <motion.div
                  className="
                    h-full 
                    bg-gradient-to-r from-purple-400 to-blue-400 
                    rounded-full 
                    shadow-sm
                  "
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ 
                    duration: 0.3, 
                    ease: "easeOut",
                    type: "tween"
                  }}
                />
              </div>
              
              {/* Loading Text */}
              <p className="
                text-white/80 
                text-xs sm:text-sm 
                font-medium 
                mb-1
                min-h-[1rem]
              ">
                {loadingText}
              </p>
              
              {/* Progress Percentage */}
              <p className="
                text-white/60 
                text-xs
                tabular-nums
              ">
                {Math.round(progress)}%
              </p>
            </motion.div>

            {/* Loading Animation Dots */}
            <div className="flex justify-center space-x-1.5 sm:space-x-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="
                    w-2 h-2 
                    sm:w-3 sm:h-3 
                    bg-gradient-to-r from-purple-400 to-blue-400 
                    rounded-full
                    transform-gpu
                  "
                  animate={prefersReducedMotion ? {} : {
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut"
                  }}
                  style={{ willChange: prefersReducedMotion ? 'auto' : 'transform, opacity' }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// Add display name for better debugging
LoadingScreen.displayName = 'LoadingScreen';

export default LoadingScreen;
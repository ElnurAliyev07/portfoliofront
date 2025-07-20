import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');

  useEffect(() => {
    const loadingSteps = [
      { text: 'Initializing...', duration: 300 },
      { text: 'Loading assets...', duration: 500 },
      { text: 'Preparing experience...', duration: 400 },
      { text: 'Almost ready...', duration: 300 }
    ];

    let currentStep = 0;
    let currentProgress = 0;

    const progressInterval = setInterval(() => {
      currentProgress += Math.random() * 15 + 5;
      if (currentProgress > 100) currentProgress = 100;
      
      setProgress(currentProgress);
      
      if (currentStep < loadingSteps.length) {
        const stepProgress = ((currentStep + 1) / loadingSteps.length) * 100;
        if (currentProgress >= stepProgress) {
          setLoadingText(loadingSteps[currentStep].text);
          currentStep++;
        }
      }
      
      if (currentProgress >= 100) {
        clearInterval(progressInterval);
        setTimeout(onComplete, 500);
      }
    }, 100);

    return () => clearInterval(progressInterval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 z-50 flex items-center justify-center overflow-x-hidden" // overflow-x-hidden əlavə edildi
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-full mx-auto px-4 sm:px-6"> {/* max-w-md -> max-w-full, px-6 -> px-4 sm:px-6 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <motion.div
            className="w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center" // Responsive ölçülər
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <span className="text-xl sm:text-2xl font-bold text-white">EA</span>
          </motion.div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-4"> {/* Responsive font */}
            Elnur Aliyev
          </h2>
          <p className="text-white/70 text-base sm:text-lg">AI/ML Engineer & Python Full-Stack Developer</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="w-full bg-white/10 rounded-full h-2 mb-4 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
          <p className="text-white/80 text-xs sm:text-sm font-medium">{loadingText}</p>
          <p className="text-white/60 text-xs mt-1">{Math.round(progress)}%</p>
        </motion.div>

        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
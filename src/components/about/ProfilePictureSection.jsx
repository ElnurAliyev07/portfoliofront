import { motion } from 'framer-motion';
import { useState } from 'react';

// Animation variants
const containerVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      staggerChildren: 0.2
    }
  }
};

const contentVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const floatingElementVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Floating elements data
const FLOATING_ELEMENTS = [
  { id: 1, className: "absolute top-4 right-4 w-3 h-3 bg-[var(--primary)] rounded-full", delay: 0 },
  { id: 2, className: "absolute bottom-4 left-4 w-2 h-2 bg-pink-500 rounded-full", delay: 1 },
  { id: 3, className: "absolute top-1/2 left-4 w-1 h-1 bg-blue-500 rounded-full", delay: 2 },
  { id: 4, className: "absolute top-8 left-8 w-2 h-2 bg-purple-500 rounded-full", delay: 1.5 },
  { id: 5, className: "absolute bottom-8 right-8 w-1.5 h-1.5 bg-green-500 rounded-full", delay: 0.5 }
];

const PROFILE_BADGES = [
  { 
    text: "Fresh Graduate", 
    color: "bg-indigo-500/20 text-indigo-500 dark:text-purple-300", 
    icon: "🎓" 
  },
  { 
    text: "ML Enthusiast", 
    color: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
    icon: "🤖"
  },
  { 
    text: "Problem Solver", 
    color: "bg-green-500/20 text-green-700 dark:text-green-300",
    icon: "💡"
  }
];

// Components
const FloatingElement = ({ element }) => (
  <motion.div
    key={element.id}
    className={element.className}
    variants={floatingElementVariants}
    animate="animate"
    style={{
      animationDelay: `${element.delay}s`
    }}
  />
);

const ProfileBadge = ({ badge, index }) => (
  <motion.div
    key={badge.text}
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.05 }}
    transition={{ 
      duration: 0.3, 
      delay: index * 0.1,
      ease: "easeOut"
    }}
    viewport={{ once: true }}
    className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 ${badge.color} cursor-default`}
  >
    <span>{badge.icon}</span>
    <span>{badge.text}</span>
  </motion.div>
);

const ProfileImage = ({ image, isLoaded, setIsLoaded }) => (
  <div className="relative w-full max-w-[20rem] h-80 mx-auto rounded-2xl overflow-hidden bg-gradient-to-br from-[var(--primary)]/20 via-pink-500/10 to-blue-500/20 border-2 border-[var(--primary)]/30 shadow-2xl sm:w-80">
    {/* Loading placeholder */}
    {!isLoaded && (
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 to-pink-500/10 animate-pulse flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[var(--primary)]/30 border-t-[var(--primary)] rounded-full animate-spin"></div>
      </div>
    )}
    
    {/* Profile Image */}
    <motion.img
      src={image}
      alt="Profile"
      className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      loading="lazy"
      onLoad={() => setIsLoaded(true)}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    />
    
    {/* Floating Elements */}
    {FLOATING_ELEMENTS.map(element => (
      <FloatingElement key={element.id} element={element} />
    ))}
    
    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
  </div>
);

const ProfileInfo = () => (
  <motion.div
    variants={contentVariants}
    className="mt-6 text-center space-y-4"
  >
    <div className="space-y-2">
      <h4
        className="font-bold text-xl"
        style={{color: '#000000' }}
      >
        🎓 Information Security Graduate
      </h4>
      <p className="text-[var(--muted-foreground)] text-base">
        Passionate about <span className="text-[var(--primary)] font-semibold">Computer Vision</span> & 
        <span className="text-[var(--primary)] font-semibold"> Machine Learning</span>
      </p>
    </div>
    
    {/* Profile Badges */}
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      {PROFILE_BADGES.map((badge, index) => (
        <ProfileBadge key={badge.text} badge={badge} index={index} />
      ))}
    </div>
    
    {/* Additional Info */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      viewport={{ once: true }}
      className="pt-4 border-t border-[var(--border)]/30 bg-white/80 dark:bg-black/80 rounded-lg"
    >
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
        🌍 Based in Baku, Azerbaijan
      </p>
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
        🚀 Ready for new opportunities
      </p>
    </motion.div>
  </motion.div>
);

// Main Component
const ProfilePictureSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const image = 'myimage3.jpg';

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className="relative group flex justify-center"
    >
      {/* Background Glow Effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-[var(--primary)]/20 to-pink-500/20 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
      
      {/* Main Container */}
      <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-[var(--background)]/90 to-[var(--background)]/70 backdrop-blur-sm border border-[var(--border)]/30 hover:border-[var(--primary)]/50 transition-all duration-500 w-full max-w-lg">
        <div className="p-6 flex flex-col items-center">
          <ProfileImage 
            image={image} 
            isLoaded={isLoaded} 
            setIsLoaded={setIsLoaded} 
          />
          <ProfileInfo />
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary)] via-pink-500 to-blue-500" />
      </div>
    </motion.div>
  );
};

export default ProfilePictureSection;
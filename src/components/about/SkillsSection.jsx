import { motion, useInView } from 'framer-motion';
import { useState, useRef, useMemo, useCallback } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

// Sadələşdirilmiş animasiya variantları
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 }
};

const slideUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

// Skills data with realistic levels
const SKILL_CATEGORIES = [
  {
    id: 'backend',
    name: 'Backend Development',
    icon: '🔧',
    color: 'from-green-500 to-emerald-500',
    description: 'Building and maintaining server-side applications',
    skills: [
      { name: 'Python', level: 80, description: 'Core programming language' },
      { name: 'Django', level: 70, description: 'Web framework for rapid development' },
      { name: 'Django REST Framework', level: 65, description: 'Building APIs' },
      { name: 'PostgreSQL', level: 75, description: 'Working with databases' },
      { name: 'AWS (EC2, S3, Lambda)', level: 50, description: 'Cloud services exposure' },
      { name: 'Docker', level: 55, description: 'Containerization basics' },
      { name: 'Git', level: 85, description: 'Version control usage' },
      { name: 'Linux Command Line', level: 70, description: 'Basic system administration' },
    ],
  },
  {
    id: 'ml',
    name: 'AI/ML & Computer Vision',
    icon: '🤖',
    color: 'from-purple-500 to-violet-500',
    description: 'Developing AI and vision-based solutions',
    skills: [
      { name: 'PyTorch / TensorFlow', level: 60, description: 'Working with ML frameworks' },
      { name: 'OpenCV', level: 65, description: 'Image processing tools' },
      { name: 'ArcFace', level: 55, description: 'Face recognition exposure' },
      { name: 'OCR', level: 60, description: 'Text recognition tasks' },
      { name: 'scikit-learn', level: 60, description: 'Machine learning utilities' },
      { name: 'ONNX Runtime', level: 50, description: 'Model deployment basics' },
      { name: 'Numpy', level: 75, description: 'Numerical operations in ML' },
      { name: 'Pandas', level: 70, description: 'Data handling for ML tasks' },
    ],
  },
  {
    id: 'frontend',
    name: 'Frontend Development',
    icon: '🎨',
    color: 'from-blue-500 to-cyan-500',
    description: 'Creating user-friendly web interfaces',
    skills: [
      { name: 'React', level: 60, description: 'Building dynamic UIs' },
      { name: 'Tailwind CSS', level: 65, description: 'Styling with utility-first CSS' },
      { name: 'JavaScript', level: 60, description: 'Core web programming' },
      { name: 'TypeScript', level: 55, description: 'Typed JavaScript basics' },
      { name: 'HTML/CSS', level: 85, description: 'Web development fundamentals' },
    ],
  },
  {
    id: 'tools',
    name: 'Tools & APIs',
    icon: '🛠️',
    color: 'from-orange-500 to-red-500',
    description: 'Using development tools and integrations',
    skills: [
      { name: 'VS Code', level: 85, description: 'Primary code editor' },
      { name: 'Postman', level: 65, description: 'Testing APIs' },
      { name: 'Telegram Bot API', level: 70, description: 'Building bots' },
      { name: 'Restful Api', level: 55, description: 'Automating workflows' },
      { name: 'Railway', level: 60, description: 'Deploying applications' },
    ],
  },
];

// Memoized utility functions
const getSkillColor = (level) => {
  if (level >= 70) return 'from-green-500 to-emerald-500';
  if (level >= 60) return 'from-blue-500 to-cyan-500';
  if (level >= 50) return 'from-yellow-500 to-orange-500';
  return 'from-gray-500 to-gray-600';
};

const getSkillLevel = (level) => {
  if (level >= 70) return 'Strong';
  if (level >= 60) return 'Proficient';
  if (level >= 50) return 'Familiar';
  return 'Beginner';
};

// Optimized Components
const SkillBar = ({ skill, index, categoryColor, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Memoize computed values
  const skillData = useMemo(() => ({
    colorClass: getSkillColor(skill.level),
    levelText: getSkillLevel(skill.level)
  }), [skill.level]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);
  
  return (
    <div
      className="group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-1">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="font-medium text-sm truncate">{skill.name}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${skillData.colorClass} text-white font-medium flex-shrink-0`}>
            {skillData.levelText}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-sm text-[var(--muted-foreground)] font-medium">{skill.level}%</span>
        </div>
      </div>
      
      {/* Progress Bar - Simplified */}
      <div className="relative mb-3">
        <div className="w-full bg-[var(--muted)] rounded-full h-2.5 overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${categoryColor} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: isVisible ? `${skill.level}%` : 0 }}
            transition={{ duration: 0.6, delay: index * 0.05 }}
          />
        </div>
      </div>
      
      {/* Description */}
      <p className={`text-xs text-[var(--muted-foreground)] italic transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-70'}`}>
        {skill.description}
      </p>
    </div>
  );
};

const CategoryCard = ({ category, index }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  // Memoize category stats
  const categoryStats = useMemo(() => ({
    skillCount: category.skills.length,
    avgLevel: Math.round(category.skills.reduce((acc, skill) => acc + skill.level, 0) / category.skills.length)
  }), [category.skills]);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);
  
  return (
    <motion.div
      ref={ref}
      {...slideUp}
      viewport={{ once: true, amount: 0.2 }}
      className="group relative"
    >
      {/* Main Card */}
      <div className="relative p-4 md:p-6 rounded-xl bg-[var(--background)]/90 backdrop-blur-sm border border-[var(--border)]/30 hover:border-[var(--primary)]/50 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center text-white text-sm md:text-lg flex-shrink-0`}>
              {category.icon}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-base md:text-lg font-bold truncate">{category.name}</h4>
              <p className="text-xs text-[var(--muted-foreground)] line-clamp-1">{category.description}</p>
            </div>
          </div>
          
          {/* Expand/Collapse Button */}
          <button
            onClick={toggleExpanded}
            className="p-2 rounded-lg hover:bg-[var(--muted)]/50 transition-colors flex items-center justify-center flex-shrink-0"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-[var(--muted-foreground)]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[var(--muted-foreground)]" />
            )}
          </button>
        </div>
        
        {/* Skills List */}
        <motion.div
          initial={false}
          animate={{ 
            height: isExpanded ? 'auto' : 0,
            opacity: isExpanded ? 1 : 0
          }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden"
        >
          <div className="space-y-4">
            {category.skills.map((skill, skillIndex) => (
              <SkillBar
                key={skill.name}
                skill={skill}
                index={skillIndex}
                categoryColor={category.color}
                isVisible={isInView}
              />
            ))}
          </div>
        </motion.div>
        
        {/* Category Stats */}
        <div className="mt-4 pt-4 border-t border-[var(--border)]/30">
          <div className="flex justify-between items-center text-xs text-[var(--muted-foreground)]">
            <span>{categoryStats.skillCount} skills</span>
            <span>Avg: {categoryStats.avgLevel}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SectionHeader = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  return (
    <motion.div
      ref={ref}
      {...fadeIn}
      viewport={{ once: true, amount: 0.3 }}
      className="text-center mb-8 md:mb-12 px-4"
    >
      <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
        Technical Skills
      </h3>
      <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
        My hands-on experience with <span className="text-[var(--primary)] font-semibold">AI/ML</span>, 
        <span className="text-[var(--primary)] font-semibold">backend</span>, and 
        <span className="text-[var(--primary)] font-semibold">frontend</span> technologies
      </p>
      
      {/* Skill Summary */}
      <div className="flex justify-center gap-4 md:gap-6 mt-6">
        <div className="text-center">
          <div className="text-xl md:text-2xl font-bold text-[var(--primary)]">25+</div>
          <div className="text-xs text-[var(--muted-foreground)]">Technologies</div>
        </div>
        <div className="text-center">
          <div className="text-xl md:text-2xl font-bold text-[var(--primary)]">4</div>
          <div className="text-xs text-[var(--muted-foreground)]">Categories</div>
        </div>
        <div className="text-center">
          <div className="text-xl md:text-2xl font-bold text-[var(--primary)]">60%</div>
          <div className="text-xs text-[var(--muted-foreground)]">Avg Level</div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Component
const SkillsSection = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, {
    once: true,
    margin: '0px 0px -100px 0px'
  });

  return (
    <section className="py-12 px-0">
      <SectionHeader />

      <motion.div
        ref={containerRef}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.6,
              ease: [0.25, 0.1, 0.25, 1],
              staggerChildren: 0.1
            }
          }
        }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto"
      >
        {SKILL_CATEGORIES.map((category, index) => (
          <CategoryCard key={category.id} category={category} index={index} />
        ))}
      </motion.div>

      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all duration-300">
          <span className="text-sm text-indigo-500 font-medium">
            🚀 Actively enhancing my technical skills
          </span>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;

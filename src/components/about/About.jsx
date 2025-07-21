import { motion } from 'framer-motion';
import { useState } from 'react';
import { Calendar, MapPin, ExternalLink, GraduationCap, Briefcase } from 'lucide-react';
import ProfilePictureSection from './ProfilePictureSection';
import SkillsSection from './SkillsSection';
import StatsCounter from './StatsCounter';

// Animation variants with optimized motion
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

// Experience data with enhanced structure
const EXPERIENCES = [
  {
    id: 1,
    type: 'education',
    title: 'Information Security Graduate',
    institution: 'Academy of the State Customs Committee',
    location: 'Baku, Azerbaijan',
    startDate: '2021-09',
    endDate: '2025-06',
    isCurrent: false,
    description: 'Completed a degree in Information Security. Gained a solid understanding of cybersecurity concepts such as network protection, cryptography, and system security. Also explored how AI and machine learning can be used in security-related tasks like threat detection and biometric verification.',
    achievements: [
      'Learned core topics like network security, cryptographic methods, and risk assessment',
      'Worked on a final project involving a video-based facial recognition system for access control',
      'Gained basic experience applying machine learning to detect unusual behavior or verify identity',
      'Participated in student competitions and small research projects related to AI and security',
      'Studied common security frameworks, including ISO/IEC 27001, through course projects'
    ],
    technologies: ['Network Security & Firewall Basics', 'Vulnerability Testing & Simple Penetration Testing',
       'Cryptography Fundamentals', 'Linux and Windows System Security', 'Secure Web Practices (OWASP Top 10 awareness)'],
    category: 'Education'
  },
  {
    id: 2,
    type: 'work',
    company: 'QSS Analytics',
    position: 'Machine Learning Intern',
    location: 'On-site',
    startDate: '2025-02',
    endDate: '2025-05',
    isCurrent: false,
    companyUrl: 'https://www.dsa.az/',
    description: 'Gained hands-on experience in machine learning workflows including data preprocessing, model development using scikit-learn, and data analysis. Worked on real-world ML projects and contributed to data-driven solutions.',
    achievements: [
      'Performed comprehensive data preprocessing and cleaning',
      'Developed and trained ML models using scikit-learn',
      'Conducted statistical analysis and data visualization',
      'Collaborated with senior data scientists on project deliverables',
      'Improved model accuracy through feature engineering',
    ],
    technologies: ['Python', 'scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'FastApi'],
    category: 'Work'
  },
];

// Utility functions
const getExperienceStyles = (type) => {
  return type === 'education'
    ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
    : 'bg-green-500/20 text-green-700 dark:text-green-300';
};

// Components
const SectionHeader = ({ title, subtitle, className = "" }) => (
  <motion.div
    {...fadeInUp}
    viewport={{ once: true }}
    className={`text-center mb-12 ${className}`}
  >
    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
      {title}
    </h2>
    <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6 rounded-full"></div>
    {subtitle && (
      <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
        {subtitle}
      </p>
    )}
  </motion.div>
);

const ExperienceCard = ({ experience, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isEven = index % 2 === 0;

  return (
    <motion.div
      key={experience.id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true }}
      className={`relative flex items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
    >
      {/* Timeline dot */}
      <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-4 border-[var(--background)] z-10 flex items-center justify-center">
        {experience.type === 'education' ? (
          <GraduationCap className="w-4 h-4 text-white" />
        ) : (
          <Briefcase className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Content */}
      <div className={`ml-16 md:ml-0 md:w-1/2 ${isEven ? 'md:pr-8' : 'md:pl-8'}`}>
        <div className="p-6 rounded-xl bg-[var(--background)]/80 backdrop-blur-sm border border-[var(--border)]/50 hover:border-purple-500/30 transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-2xl font-semibold mb-2">
                {experience.type === 'education' ? experience.title : experience.position}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                {experience.type === 'education' ? (
                  <span className="text-purple-500 font-medium">{experience.institution}</span>
                ) : (
                  <a
                    href={experience.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-500 hover:text-purple-600 font-medium flex items-center gap-1"
                  >
                    {experience.company}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-[var(--muted-foreground)]">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(experience.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -
                  {experience.isCurrent
                    ? ' Present'
                    : ` ${new Date(experience.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {experience.location}
                </div>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getExperienceStyles(experience.type)}`}
            >
              {experience.category}
            </span>
          </div>

          <p className="text-[var(--muted-foreground)] mb-4 leading-relaxed">{experience.description}</p>

          {/* Toggle Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-purple-500 hover:text-purple-600 font-medium flex items-center gap-2 mb-4 transition-colors"
          >
            {isExpanded ? 'Hide Details' : 'Show Details'}
            <motion.span
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              ▼
            </motion.span>
          </button>

          {/* Achievements */}
          <motion.div
            initial={false}
            animate={{ 
              height: isExpanded ? 'auto' : 0,
              opacity: isExpanded ? 1 : 0
            }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-4 pb-4">
              <div>
                <h4 className="font-medium text-sm mb-2">
                  {experience.type === 'education' ? 'Key Achievements:' : 'Key Responsibilities:'}
                </h4>
                <ul className="space-y-2">
                  {experience.achievements.map((achievement, i) => (
                    <li key={i} className="text-sm text-[var(--muted-foreground)] flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technologies */}
              <div>
                <h4 className="font-medium text-sm mb-2">Key Skills:</h4>
                <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-purple-500/20 bg-purple-500/5">
                  {experience.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-1 rounded-full bg-[var(--muted)]/50 hover:bg-purple-500/10 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const ExperienceTimeline = () => (
  <section id="experience" className="py-16 px-4">
    <div className="max-w-4xl mx-auto">
      <SectionHeader
        title="Education & Experience"
        subtitle="My academic journey and professional experience in AI/ML engineering"
      />
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-pink-500"></div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="space-y-12"
        >
          {EXPERIENCES.map((experience, index) => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

const AboutContent = () => (
<div className="mb-16 px-4 sm:px-6 lg:px-8">
  {/* Text content */}
  <motion.div
  initial={{ opacity: 0, x: -30 }}
  whileInView={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
  viewport={{ once: true }}
  className="space-y-4"
>
  <p className="text-base text-muted-foreground leading-relaxed"> 
    I'm a graduate in Information Security from the Academy of the State Customs Committee. 
    I have a solid background in Python and specialize in building practical AI/ML solutions and full-stack applications.
  </p>
  <p className="text-base text-muted-foreground leading-relaxed">
    Over time, I've focused on developing intelligent systems using tools like Django, React, and machine learning frameworks. 
    My key areas of interest include computer vision, facial recognition, and creating useful, real-world applications that combine backend logic with smart AI features.
  </p>
  <p className="text-base text-muted-foreground leading-relaxed">
    I'm currently seeking opportunities where I can apply my skills in AI/ML and backend development, collaborate with others on meaningful projects, and continue learning and growing as a developer.
  </p>
</motion.div>

  {/* Profile Picture and Stats side by side */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 items-center">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true }}
    >
      <StatsCounter />
    </motion.div>

    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true }}
    >
      <ProfilePictureSection />
    </motion.div>
  </div>
</div>

);

// Main About Component
const About = () => {
  return (
    <section 
      id="about" 
      className="py-16 px-4 bg-gradient-to-b from-[var(--background)] via-[var(--background)] to-[var(--muted)]/20 w-full"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="About Me"
          className="text-gray-200 mb-12"
        />
        
        <AboutContent />
        <SkillsSection />
      </div>
      
      <ExperienceTimeline />
    </section>
  );
};

export default About;
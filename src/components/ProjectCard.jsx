import { useState, useRef, useEffect } from 'react';
import { Github, ExternalLink, Star, Calendar, Users, Zap, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { starProject } from '../api/projectApi';

const BACKEND_URL = 'https://portfoliobackend-n9dv.onrender.com';

// Intersection Observer Hook
function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const targetRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsIntersecting(true);
          setHasAnimated(true);
        }
      },
      { threshold: 0.1, rootMargin: '-50px', ...options }
    );

    if (targetRef.current) observer.observe(targetRef.current);
    return () => observer.disconnect();
  }, [hasAnimated, options]);

  return [targetRef, isIntersecting];
}

function ProjectCard({ project, index, onStarUpdate }) {
  const [isHovered, setIsHovered] = useState(false);
  const [cardRef, isVisible] = useIntersectionObserver();
  const [starsCount, setStarsCount] = useState(project.stats_stars || 0);
  const [isStarred, setIsStarred] = useState(project.is_starred || false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Production': return 'from-green-400 to-emerald-500';
      case 'Active Development': return 'from-blue-400 to-cyan-500';
      case 'Beta': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'AI/ML': 'from-purple-500 to-pink-500',
      'Computer Vision': 'from-blue-500 to-cyan-500',
      'IoT': 'from-green-500 to-emerald-500',
      'Blockchain': 'from-orange-500 to-red-500',
      'FinTech': 'from-indigo-500 to-purple-500',
      'DevOps': 'from-gray-600 to-gray-700'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  const handleStar = async (e) => {
    e.stopPropagation(); // Prevent parent click handlers from interfering
    console.log('handleStar triggered for project ID:', project.id);
    try {
      const response = await starProject(project.id);
      console.log('Star API response:', response);
      if (response.status === 'starred' || response.status === 'already_starred') {
        setStarsCount(response.stars_count);
        setIsStarred(true);
        if (onStarUpdate) {
          console.log('Notifying parent with:', { projectId: project.id, starsCount: response.stars_count, isStarred: true });
          onStarUpdate(project.id, response.stars_count, true);
        }
      } else {
        console.warn('Unexpected star response status:', response.status);
      }
    } catch (error) {
      console.error('Error starring project:', error.message);
      if (error.response) {
        console.error('API error details:', error.response.data);
      }
    }
  };

  const imageUrl = project.featured_image
    ? project.featured_image.startsWith('http')
      ? project.featured_image
      : `${BACKEND_URL}${project.featured_image}`
    : 'https://via.placeholder.com/600x400?text=No+Image';

  return (
    <div
      ref={cardRef}
      className="group cursor-pointer h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: `translateY(${isHovered ? -8 : 0}px) translateY(${isVisible ? 0 : 40}px)`,
        opacity: isVisible ? 1 : 0,
        transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`,
        transitionProperty: 'transform, opacity'
      }}
    >
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 h-full border border-gray-200/50 dark:border-gray-700/50">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative overflow-hidden">
          <div
            className="w-full h-[12rem] sm:h-56 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"
            style={{
              transform: `scale(${isHovered ? 1.05 : 1})`,
              transition: 'transform 0.6s ease-out'
            }}
          >
            <img
              src={imageUrl}
              alt={project.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          
          <div 
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
            style={{
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease-out'
            }}
          />
          
          {project.is_featured && (
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
              <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg">
                <Star className="w-3 h-3" />
                Featured
              </div>
            </div>
          )}

          <div 
            className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4"
            style={{
              opacity: isHovered ? 1 : 0,
              transform: `translateY(${isHovered ? 0 : 20}px)`,
              transition: 'all 0.3s ease-out'
            }}
          >
            <div className="flex gap-2 sm:gap-3">
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/95 dark:bg-gray-900/95 text-gray-900 dark:text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium shadow-lg hover:bg-white dark:hover:bg-gray-900 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Github className="w4 h-4" />
                Code
              </a>
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium shadow-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </a>
              <Link
                to={`/project/${project.id}`}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium shadow-lg hover:from-blue-700 hover:to-cyan-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                See More
              </Link>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 flex flex-col flex-1">
          <div className="mb-3">
            <span className={`inline-block text-xs font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-gradient-to-r ${getCategoryColor(project.category)} text-white`}>
              {project.category}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-300 leading-tight">
            {project.title}
          </h3>

          <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed mb-4 flex-1">
            {project.short_description}
          </p>

          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{project.year}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{project.team_size} team</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>{project.impact}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.slice(0, 4).map((tech) => (
              <span 
                key={tech} 
                className="text-xs px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="text-xs px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                +{project.technologies.length - 4} more
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-xs pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-purple-600 dark:text-purple-400 font-medium">
              {project.duration}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
    <button
  onClick={handleStar}
  className={`focus:outline-none transition-transform duration-200 ease-in-out transform hover:scale-110 ${
    isStarred ? 'text-yellow-500 scale-110' : 'text-gray-600 dark:text-gray-400'
  }`}
>
  <Star className={`w-4 h-4 ${isStarred ? 'fill-current animate-pingOnce' : ''}`} />
</button>

                <span>{starsCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Eye className="w-4 h-4" />
                <span>{project.stats_views.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getProjects } from '../api/projectApi';
import ProjectCard from './ProjectCard';

// Intersection Observer hook
function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const targetRef = React.useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsIntersecting(true);
          setHasAnimated(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '-50px',
        ...options
      }
    );

    if (targetRef.current) observer.observe(targetRef.current);
    return () => observer.disconnect();
  }, [hasAnimated, options]);

  return [targetRef, isIntersecting];
}

function Projects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [headerRef, headerVisible] = useIntersectionObserver();
  const [filterRef, filterVisible] = useIntersectionObserver();
  const [seeMoreRef, seeMoreVisible] = useIntersectionObserver();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedProjects = await getProjects();
        setProjects(fetchedProjects.slice(0, 3));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to load projects');
        setProjects([]);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStarUpdate = (projectId, newStarsCount, isStarred) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId
          ? { ...project, stats_stars: newStarsCount, is_starred: isStarred }
          : project
      )
    );
  };

  const filteredProjects = selectedCategory === "All"
    ? projects
    : projects.filter(project => project.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="relative">
            <div className="w-12 sm:w-16 h-12 sm:h-16 border-4 border-purple-200 dark:border-purple-800 rounded-full animate-spin">
              <div className="absolute top-0 left-0 w-12 sm:w-16 h-12 sm:h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin"></div>
            </div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium text-sm sm:text-base">Loading innovative projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-24">
        <div className="text-red-500 text-base sm:text-lg font-medium">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 sm:px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section id="projects" className="py-12 px-2 sm:px-4 bg-gradient-to-br from-purple-50/50 via-white to-pink-50/50 dark:from-purple-900/20 dark:via-gray-900 dark:to-pink-900/20 min-h-screen w-full overflow-x-hidden">
      <div className="max-w-full mx-auto">
        <div 
          ref={headerRef}
          className="text-center mb-12"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: `translateY(${headerVisible ? 0 : 50}px)`,
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <div className="inline-block">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Featured Projects
            </h2>
            <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full mb-6"></div>
          </div>
<p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4 leading-relaxed">
  Discover my latest innovations in AI/ML, computer vision, and full-stack development. 
  Each project represents a unique solution to real-world challenges.
</p>

        </div>

        <div 
          ref={filterRef}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-4"
          style={{
            opacity: filterVisible ? 1 : 0,
            transform: `translateY(${filterVisible ? 0 : 30}px)`,
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s'
          }}
        >
          {/* Filter buttons */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <ProjectCard 
                key={`${project.id}-${selectedCategory}`} 
                project={project} 
                index={index} 
                onStarUpdate={handleStarUpdate}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">
                No projects found in the selected category.
              </div>
            </div>
          )}
        </div>

        <div 
          ref={seeMoreRef}
          className="mt-12 text-center"
          style={{
            opacity: seeMoreVisible ? 1 : 0,
            transform: `translateY(${seeMoreVisible ? 0 : 30}px)`,
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s'
          }}
        >
          <Link
            to="/all-projects"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 sm:px-6 py-2 sm:py-3 hover:text-sky-300 rounded-xl text-sm font-semibold shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105"
          >
            <ExternalLink className="w-4 h-4" />
            See More Projects
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}

export default Projects;
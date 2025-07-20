import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Filter, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getProjects } from '../api/projectApi';
import ProjectCard from '../components/ProjectCard';

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

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, [hasAnimated, options]);

  return [targetRef, isIntersecting];
}

function AllProjects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [headerRef, headerVisible] = useIntersectionObserver();

  // Extract unique categories from projects
  const categories = ["All", ...new Set(projects.map(project => project.category).filter(Boolean))];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const allProjects = await getProjects();
        setProjects(allProjects);
      } catch (err) {
        console.error("Error loading all projects:", err);
        setError("Failed to load projects");
      } finally {
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

  // Filter projects by category
  const filteredProjects = selectedCategory === "All" 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50/80 via-white to-pink-50/80 dark:from-purple-900/20 dark:via-gray-900 dark:to-pink-900/20">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-purple-200 dark:border-purple-800 rounded-full animate-spin">
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-purple-600 rounded-full animate-spin"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-semibold">Loading amazing projects...</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Fetching the latest work showcase</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-red-900/20 dark:via-gray-900 dark:to-pink-900/20">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
            <div className="text-red-600 dark:text-red-400 text-2xl">⚠️</div>
          </div>
          <div className="text-red-600 dark:text-red-400 text-xl font-bold mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-purple-50/80 via-white to-pink-50/80 dark:from-purple-900/20 dark:via-gray-900 dark:to-pink-900/20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Navigation Bar */}
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-700/20 py-4 mb-8">
          <div className="flex items-center justify-between">
            <Link 
              to="/"
              className="group inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/60 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-semibold">Back to Home</span>
            </Link>
            
            {/* Project Count */}
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300">
              <span className="text-sm font-medium">
                {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'}
                {selectedCategory !== "All" && ` in ${selectedCategory}`}
              </span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-16 pt-8"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: `translateY(${headerVisible ? 0 : 50}px)`,
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <div className="inline-block mb-6">
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
              All Projects
            </h1>
            <div className="w-32 h-1.5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 mx-auto rounded-full"></div>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Explore my complete portfolio of innovative projects spanning multiple technologies and industries.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
            <div className="flex flex-wrap justify-center gap-3">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mr-4 mb-2">
                <Filter className="w-5 h-5" />
                <span className="text-sm font-semibold">Filter by Category:</span>
              </div>
              {categories.map((category, index) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl transform scale-105'
                      : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 shadow-lg hover:shadow-xl backdrop-blur-sm'
                  }`}
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {category}
                  {category !== "All" && (
                    <span className="ml-2 text-xs opacity-75">
                      ({projects.filter(project => project.category === category).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <div
                  key={`${project.id}-${index}`}
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                  className="opacity-0 animate-fade-in-up"
                >
                  <ProjectCard 
                    project={project} 
                    index={index} 
                    onStarUpdate={handleStarUpdate}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="text-gray-400 dark:text-gray-600 text-3xl">🔍</div>
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-xl font-semibold mb-2">
                  No projects found
                </div>
                <p className="text-gray-400 dark:text-gray-500 mb-6">
                  {selectedCategory !== "All" ? (
                    <>No projects found in "{selectedCategory}" category.</>
                  ) : (
                    <>No projects available at the moment.</>
                  )}
                </p>
                {selectedCategory !== "All" && (
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    View All Projects
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
}

export default AllProjects;
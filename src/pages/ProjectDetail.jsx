import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectById, starProject } from '../api/projectApi';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  Zap, 
  Star, 
  Eye, 
  Share2, 
  Sparkles, 
  TrendingUp,
  Home,
  ExternalLink,
  Github
} from 'lucide-react';

const BACKEND_URL = 'https://portfoliobackend-n9dv.onrender.com';

// Custom hook for project data
const useProjectData = (projectId) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProjectById(projectId);
        if (data) {
          setProject(data);
        } else {
          setError('Project not found');
        }
      } catch (err) {
        setError('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  return { project, loading, error };
};

// Loading component with improved design
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center px-4">
    <div className="text-center">
      <div className="relative">
        <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-16 h-16 sm:w-20 sm:h-20 border-4 border-transparent border-t-blue-600 rounded-full animate-spin" />
        </div>
      </div>
      <p className="mt-4 sm:mt-6 text-gray-600 dark:text-gray-400 font-medium text-base sm:text-lg">Loading project details...</p>
    </div>
  </div>
);

// Error component with improved navigation
const ErrorMessage = ({ error }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center p-4">
    <div className="text-center max-w-sm sm:max-w-md mx-auto">
      <div className="text-red-500 text-lg sm:text-xl font-semibold mb-4 sm:mb-6">{error}</div>
      <div className="flex flex-col gap-3 sm:gap-4">
        <Link 
          to="/all-projects"
          className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
        <Link 
          to="/"
          className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
        >
          <Home className="w-4 h-4" />
          Home
        </Link>
      </div>
    </div>
  </div>
);

// Enhanced navigation header
const NavigationHeader = () => (
  <div className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link 
            to="/all-projects"
            className="inline-flex items-center gap-1 sm:gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden xs:inline">Back to</span> Projects
          </Link>
          <div className="hidden sm:block w-px h-4 sm:h-6 bg-gray-300 dark:bg-gray-600"></div>
          <Link 
            to="/"
            className="hidden sm:inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
        </div>
      </div>
    </div>
  </div>
);

// Project badges component
const ProjectBadges = ({ isFeatured, viewsCount }) => (
  <div className="absolute top-3 right-3 sm:top-6 sm:right-6 flex flex-col gap-1 sm:gap-2">
    {isFeatured && (
      <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg backdrop-blur-sm">
        <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
        <span className="hidden xs:inline">Featured</span>
      </div>
    )}
    {viewsCount > 1000 && (
      <div className="flex items-center gap-1 bg-gradient-to-r from-green-400 to-blue-500 text-white text-xs font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg backdrop-blur-sm">
        <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
        <span className="hidden xs:inline">Trending</span>
      </div>
    )}
  </div>
);

// Project stats component with enhanced design
const ProjectStats = ({ project, starsCount, isStarred, onStar }) => (
  <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-6 sm:mb-8">
    <div className="flex items-center gap-1.5 sm:gap-2">
      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
      <span className="font-medium">{project.year}</span>
    </div>
    <div className="flex items-center gap-1.5 sm:gap-2">
      <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
      <span className="font-medium">{project.team_size} team</span>
    </div>
    <div className="flex items-center gap-1.5 sm:gap-2 col-span-2 sm:col-span-1">
      <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" />
      <span className="font-medium truncate">{project.impact}</span>
    </div>
    <div className="flex items-center gap-1.5 sm:gap-2">
      <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500 flex-shrink-0" />
      <span className="font-medium">{project.stats_views > 999 ? `${(project.stats_views/1000).toFixed(1)}k` : (project.stats_views || 0)}</span>
    </div>
    <div className="flex items-center gap-1.5 sm:gap-2 justify-center sm:justify-start">
      <button
        onClick={onStar}
        className={`focus:outline-none transition-all duration-200 p-1 rounded-full ${
          isStarred 
            ? 'text-yellow-500 scale-110 bg-yellow-50 dark:bg-yellow-900/30' 
            : 'text-gray-500 dark:text-gray-400 hover:text-yellow-500 hover:scale-105 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
        }`}
        aria-label={isStarred ? 'Unstar project' : 'Star project'}
      >
        <Star className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isStarred ? 'fill-current' : ''}`} />
      </button>
      <span className="font-medium">{starsCount > 999 ? `${(starsCount/1000).toFixed(1)}k` : starsCount}</span>
    </div>
  </div>
);

// Enhanced technology tags component
const TechnologyTags = ({ technologies }) => (
  <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
    {technologies?.map((tech) => (
      <span 
        key={tech} 
        className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 font-medium border border-blue-200/50 dark:border-blue-700/50 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
      >
        {tech}
      </span>
    )) || []}
  </div>
);

// Project links component
const ProjectLinks = ({ project }) => (
  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
    {project.demo_url && (
      <a
        href={project.demo_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg sm:rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium text-sm sm:text-base"
      >
        <ExternalLink className="w-4 h-4" />
        Live Demo
      </a>
    )}
    {project.github_url && (
      <a
        href={project.github_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg sm:rounded-xl hover:from-gray-900 hover:to-black transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium text-sm sm:text-base"
      >
        <Github className="w-4 h-4" />
        GitHub
      </a>
    )}
  </div>
);

// Main component
function ProjectDetails() {
  const { projectId } = useParams();
  const { project, loading, error } = useProjectData(projectId);
  const [starsCount, setStarsCount] = useState(0);
  const [isStarred, setIsStarred] = useState(false);

  // Update stars count when project loads
  useEffect(() => {
    if (project) {
      setStarsCount(project.stats_stars || 0);
    }
  }, [project]);

  const handleStar = useCallback(async () => {
    try {
      const response = await starProject(projectId);
      if (response.status === 'starred' || response.status === 'already_starred') {
        setStarsCount(response.stars_count);
        setIsStarred(true);
      }
    } catch (err) {
      console.error('Failed to star project:', err);
    }
  }, [projectId]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.title,
          text: project.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share was cancelled');
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  }, [project]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  const imageUrl = project.featured_image
    ? project.featured_image.startsWith('http')
      ? project.featured_image
      : `${BACKEND_URL}${project.featured_image}`
    : 'https://via.placeholder.com/800x500?text=No+Image';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Navigation Header */}
      <NavigationHeader />

      {/* Main Content */}
      <main className="py-6 sm:py-12 px-4 sm:px-6 max-w-5xl mx-auto">
        <article className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
          {/* Hero image section with overlay */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
            <img
              src={imageUrl}
              alt={project.title}
              className="w-full h-[250px] sm:h-[400px] lg:h-[500px] object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x500?text=Image+Not+Found';
              }}
            />
            <ProjectBadges isFeatured={project.is_featured} viewsCount={project.stats_views} />
          </div>

          {/* Content section */}
          <div className="p-4 sm:p-8 lg:p-12">
            {/* Category */}
            <div className="mb-4 sm:mb-6">
              <span className="inline-block text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
                {project.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-white leading-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {project.title}
            </h1>

            {/* Stats */}
            <ProjectStats 
              project={project}
              starsCount={starsCount}
              isStarred={isStarred}
              onStar={handleStar}
            />

            {/* Description */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-blue-200/50 dark:border-blue-700/50">
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-medium italic">
                "{project.description}"
              </p>
            </div>

            {/* Project Links */}
            <ProjectLinks project={project} />

            {/* Content */}
            <div className="prose prose-sm sm:prose-lg dark:prose-invert mb-6 sm:mb-8 max-w-none prose-headings:text-blue-800 dark:prose-headings:text-blue-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-p:text-sm sm:prose-p:text-base">
              {project.content || 'No additional content available for this project.'}
            </div>

            {/* Technology tags */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white">Technologies Used</h3>
              <TechnologyTags technologies={project.technologies} />
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleShare}
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium text-sm sm:text-base"
              >
                <Share2 className="w-4 h-4" />
                Share Project
              </button>
              
              <Link
                to="/all-projects"
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4" />
                More Projects
              </Link>
            </div>
          </div>
        </article>

        {/* Back to home button */}
        <div className="text-center mt-8 sm:mt-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl sm:rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 font-semibold text-base sm:text-lg"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}

export default ProjectDetails;
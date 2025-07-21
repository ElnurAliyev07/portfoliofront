import { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, User, Eye, ArrowRight, Sparkles, TrendingUp, Heart, Filter, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getBlogPosts, likeBlogPost } from '../api/blogApi';

const BACKEND_URL = 'https://portfoliobackend-n9dv.onrender.com';

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
      {
        threshold: 0.1,
        rootMargin: '-50px',
        ...options
      }
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

function BlogCard({ post, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const [cardRef, isVisible] = useIntersectionObserver();
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleLike = async () => {
    try {
      const response = await likeBlogPost(post.slug);
      if (response.status === 'liked' || response.status === 'already_liked') {
        setLikesCount(response.likes_count);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const tags = Array.isArray(post.tags)
    ? post.tags
    : typeof post.tags === 'string'
      ? JSON.parse(post.tags || '[]')
      : [];

  const imageUrl = post.featured_image
    ? post.featured_image.startsWith('http')
      ? post.featured_image
      : `${BACKEND_URL}${post.featured_image}`
    : 'https://via.placeholder.com/600x400?text=No+Image';

  return (
    <div
      ref={cardRef}
      className="group cursor-pointer h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: `translateY(${isHovered ? -12 : 0}px) translateY(${isVisible ? 0 : 60}px)`,
        opacity: isVisible ? 1 : 0,
        transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1)`,
        transitionDelay: `${index * 0.1}s`
      }}
    >
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-2xl hover:shadow-3xl transition-all duration-700 h-full border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        {/* Image container */}
        <div className="relative overflow-hidden">
          <div
            className="w-full h-56 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 dark:from-gray-700 dark:via-gray-600 dark:to-gray-800 relative"
            style={{
              transform: `scale(${isHovered ? 1.1 : 1})`,
              transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
              </div>
            )}
            <img
              src={imageUrl}
              alt={post.title}
              className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />
          </div>
          
          {/* Overlay gradient */}
          <div 
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
            style={{
              opacity: isHovered ? 1 : 0.3,
              transition: 'opacity 0.5s ease-out'
            }}
          />
          
          {/* Badges */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {post.is_featured && (
              <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-2 rounded-full shadow-xl backdrop-blur-sm">
                <Sparkles className="w-3 h-3" />
                Featured
              </div>
            )}
            {post.views_count > 1000 && (
              <div className="flex items-center gap-1 bg-gradient-to-r from-green-400 to-blue-500 text-white text-xs font-bold px-3 py-2 rounded-full shadow-xl backdrop-blur-sm">
                <TrendingUp className="w-3 h-3" />
                Trending
              </div>
            )}
          </div>
          
          {/* Read button */}
          <div 
            className="absolute bottom-6 left-6 right-6"
            style={{
              opacity: isHovered ? 1 : 0,
              transform: `translateY(${isHovered ? 0 : 30}px)`,
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <Link
              to={`/blog/${post.slug}`}
              className="inline-flex items-center gap-2 bg-white/95 dark:bg-gray-900/95 text-gray-900 dark:text-white px-6 py-3 rounded-xl text-sm font-bold shadow-xl hover:bg-white dark:hover:bg-gray-900 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
            >
              Read Article
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-8 flex flex-col flex-1">
          {/* Meta information */}
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-500" />
              <span className="font-medium">{new Date(post.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span className="font-medium">{post.read_count} reads</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-green-500" />
              <span className="font-medium">{post.author}</span>
            </div>
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:via-pink-600 group-hover:to-blue-600 group-hover:bg-clip-text transition-all duration-500 leading-tight line-clamp-2">
            {post.title}
          </h3>
          
          {/* Excerpt */}
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
            {post.excerpt}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.slice(0, 3).map((tag, tagIndex) => (
              <span 
                key={tag} 
                className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200/50 dark:border-purple-700/50 hover:scale-105 transition-transform duration-200"
                style={{
                  animation: isVisible ? 'slideInUp 0.6s ease-out forwards' : 'none',
                  animationDelay: `${tagIndex * 0.1}s`
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                {post.category}
              </span>
            </div>
            <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">{post.views_count.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
               <button
  onClick={handleLike}
  className={`focus:outline-none transition-transform duration-200 ease-in-out transform hover:scale-110 ${isLiked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'} hover:text-red-500 transition-colors`}
>
  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current animate-pingOnce' : ''}`} />
</button>
                <span className="text-sm font-medium">{likesCount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AllBlogs() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [headerRef, headerVisible] = useIntersectionObserver();

  // Extract unique categories from blog posts
  const categories = ["All", ...new Set(blogPosts.map(post => post.category).filter(Boolean))];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const posts = await getBlogPosts();
        setBlogPosts(posts);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setError('Failed to load blog posts');
        setBlogPosts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter posts by category
  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50/80 via-white to-pink-50/80 dark:from-purple-900/20 dark:via-gray-900 dark:to-pink-900/20">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-purple-200 dark:border-purple-800 rounded-full animate-spin">
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-purple-600 rounded-full animate-spin"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-semibold">Loading amazing articles...</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Please wait while we fetch the latest content</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-red-900/20 dark:via-gray-900 dark:to-pink-900/20">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
            <div className="text-red-600 dark:text-red-400 text-2xl">⚠️</div>
          </div>
          <div className="text-red-600 dark:text-red-400 text-xl font-bold mb-4">{error}</div>
          <Link 
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="py-8 px-4 bg-gradient-to-br from-purple-50/80 via-white to-pink-50/80 dark:from-purple-900/20 dark:via-gray-900 dark:to-pink-900/20 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header with Navigation */}
        <div 
          ref={headerRef}
          className="relative"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: `translateY(${headerVisible ? 0 : 50}px)`,
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {/* Fixed Navigation */}
          <div className="absolute top-0 left-0 z-10">
            <Link 
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 group"
            >
              <Home className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
              <span className="font-semibold text-sm">Home</span>
            </Link>
          </div>

          {/* Title Section */}
          <div className="text-center pt-20 mb-16">
            <div className="inline-block mb-6">
              <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
                All Articles
              </h1>
              <div className="w-32 h-1.5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 mx-auto rounded-full"></div>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Explore all my articles on cutting-edge technology, AI/ML, modern development practices, 
              and the latest industry trends shaping our digital future.
            </p>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                <span className="font-medium">{blogPosts.length} Articles</span>
              </div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">{categories.length - 1} Categories</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-16 px-4">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mr-4 mb-2">
            <div className="p-2 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-md backdrop-blur-sm">
              <Filter className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold">Filter by Category:</span>
          </div>
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 mb-2 ${
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
                  ({blogPosts.filter(post => post.category === category).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Results Counter */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-full shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold">
                Showing {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
                {selectedCategory !== "All" && (
                  <span className="text-purple-600 dark:text-purple-400 ml-1">
                    in "{selectedCategory}"
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (
              <BlogCard key={post.slug} post={post} index={index} />
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                  <div className="text-4xl">📝</div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">!</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-3">
                No Articles Found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                {selectedCategory === "All" 
                  ? "No articles are available at the moment. Check back later for fresh content!" 
                  : `No articles found in the "${selectedCategory}" category. Try selecting a different category.`}
              </p>
              {selectedCategory !== "All" && (
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                >
                  View All Articles
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
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
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </section>
  );
}

export default AllBlogs;
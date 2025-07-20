import { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, User, Eye, ArrowRight, Sparkles, TrendingUp, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getBlogPosts, likeBlogPost } from '../api/blogApi';

const BACKEND_URL = 'http://localhost:8000';

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

const handleLike = async () => {
  if (isLiked) return; // İkinci dəfə klikləməyi önlə (isteğe bağlı)

  setIsLiked(true); // UI-də dərhal ürək rəngini dəyiş
  setLikesCount(prev => prev + 1); // Like sayını artır

  try {
    const response = await likeBlogPost(post.slug);
    if (response.status === 'liked' || response.status === 'already_liked') {
      setLikesCount(response.likes_count); // Serverdən gələn say ilə sinxronizasiya
    } else {
      // Serverdə problem varsa, like geri al
      setIsLiked(false);
      setLikesCount(prev => Math.max(prev - 1, 0));
      alert('Could not like the post. Please try again later.');
    }
  } catch (error) {
    // Şəbəkə xətası və ya başqa problem varsa, like geri al
    setIsLiked(false);
    setLikesCount(prev => Math.max(prev - 1, 0));
    alert('Network error. Please try again later.');
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
        transform: `translateY(${isHovered ? -8 : 0}px) translateY(${isVisible ? 0 : 40}px)`,
        opacity: isVisible ? 1 : 0,
        transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`,
        transitionProperty: 'transform, opacity'
      }}
    >
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 h-full border border-gray-200/50 dark:border-gray-700/50">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative overflow-hidden">
          <div
            className="w-full h-[10rem] sm:h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" // h-48 → h-[10rem] sm:h-48
            style={{
              transform: `scale(${isHovered ? 1.05 : 1})`,
              transition: 'transform 0.6s ease-out'
            }}
          >
            <img
              src={imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div 
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
            style={{
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease-out'
            }}
          />
          {post.is_featured && (
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4"> {/* Responsiv mövqe */}
              <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg"> {/* Responsiv padding */}
                <Sparkles className="w-3 h-3" />
                Featured
              </div>
            </div>
          )}
          {post.views_count > 1000 && (
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4"> {/* Responsiv mövqe */}
              <div className="flex items-center gap-1 bg-gradient-to-r from-green-400 to-blue-500 text-white text-xs font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg"> {/* Responsiv padding */}
                <TrendingUp className="w-3 h-3" />
                Trending
              </div>
            </div>
          )}
          <div 
            className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4" // Responsiv mövqe
            style={{
              opacity: isHovered ? 1 : 0,
              transform: `translateY(${isHovered ? 0 : 20}px)`,
              transition: 'all 0.3s ease-out'
            }}
          >
            <Link
              to={`/blog/${post.slug}`}
              className="inline-flex items-center gap-2 bg-white/95 dark:bg-gray-900/95 text-gray-900 dark:text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium shadow-lg hover:bg-white dark:hover:bg-gray-900 transition-colors" // Responsiv padding və font
            >
              Read Article
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <div className="p-4 sm:p-6 flex flex-col flex-1"> {/* p-6 → p-4 sm:p-6 */}
          <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400 mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(post.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{post.read_count} reads</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{post.author}</span>
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-300 leading-tight"> {/* Responsiv font */}
            {post.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed mb-4 flex-1"> {/* Responsiv font */}
            {post.excerpt}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag, tagIndex) => (
              <span 
                key={tag} 
                className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 font-medium border border-purple-200/50 dark:border-purple-700/50"
                style={{
                  animation: isVisible ? 'slideInUp 0.6s ease-out forwards' : 'none',
                  animationDelay: `${tagIndex * 0.1}s`
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs pt-4 border-t border-gray-200 dark:border-gray-700">
            <span className="text-purple-600 dark:text-purple-400 font-medium">
              {post.category}
            </span>
            <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{post.views_count.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
<button
  onClick={handleLike}
  className={`focus:outline-none transition-transform duration-200 ease-in-out transform hover:scale-110 ${isLiked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'} hover:text-red-500 transition-colors`}
>
  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current animate-pingOnce' : ''}`} />
</button>

                <span>{likesCount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Blog() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [headerRef, headerVisible] = useIntersectionObserver();
  const [buttonRef, buttonVisible] = useIntersectionObserver();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const posts = await getBlogPosts();
        setBlogPosts(posts.slice(0, 3));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setError('Failed to load blog posts');
        setBlogPosts([]);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="relative">
            <div className="w-12 sm:w-16 h-12 sm:h-16 border-4 border-purple-200 dark:border-purple-800 rounded-full animate-spin"> {/* Responsiv spinner */}
              <div className="absolute top-0 left-0 w-12 sm:w-16 h-12 sm:h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin"></div>
            </div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium text-sm sm:text-base">Loading amazing articles...</p>
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
    <section id="blog" className="py-12 px-2 sm:px-4 bg-gradient-to-br from-purple-50/50 via-white to-pink-50/50 dark:from-purple-900/20 dark:via-gray-900 dark:to-pink-900/20 min-h-screen w-full overflow-x-hidden"> {/* px-4 → px-2 sm:px-4, w-full və overflow-x-hidden əlavə edildi */}
      <div className="max-w-full mx-auto"> {/* max-w-7xl → max-w-full */}
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
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4"> {/* Responsiv font */}
              Latest Articles
            </h2>
            <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full mb-6"></div>
          </div>
<p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4 leading-relaxed">
            Dive into the world of cutting-edge technology with insights on AI/ML, modern development practices, 
            and the latest industry trends that shape our digital future.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8"> {/* gap-8 → gap-4 sm:gap-8 */}
          {blogPosts.length > 0 ? (
            blogPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">
                No articles available at the moment.
              </div>
            </div>
          )}
        </div>
        <div 
          ref={buttonRef}
          className="mt-12 sm:mt-16 text-center"
          style={{
            opacity: buttonVisible ? 1 : 0,
            transform: `translateY(${buttonVisible ? 0 : 50}px) scale(${buttonVisible ? 1 : 0.9})`,
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <Link
            to="/all-blogs"
            className="group inline-flex items-center gap-2 px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:text-sky-300 rounded-full font-semibold shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105" // Responsiv padding
          >
            See More Blogs
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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

export default Blog;
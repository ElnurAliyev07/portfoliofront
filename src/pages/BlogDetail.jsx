import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Calendar, Clock, User, Eye, Sparkles, TrendingUp, Heart, Share2, Home } from 'lucide-react';
import { getBlogBySlug, likeBlogPost } from '../api/blogApi';

const BACKEND_URL = 'https://portfoliobackend-n9dv.onrender.com';

// Custom hook for blog data
const useBlogData = (slug) => {
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const foundBlog = await getBlogBySlug(slug);
        if (foundBlog) {
          setBlog(foundBlog);
        } else {
          setError('Blog post not found');
        }
      } catch (err) {
        setError('Failed to load blog post');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  return { blog, isLoading, error };
};

// Loading component with improved design
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center">
    <div className="text-center">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-purple-200 dark:border-purple-800 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-purple-600 rounded-full animate-spin" />
        </div>
      </div>
      <p className="mt-6 text-gray-600 dark:text-gray-400 font-medium text-lg">Loading blog post...</p>
    </div>
  </div>
);

// Error component with improved navigation
const ErrorMessage = ({ error }) => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center">
    <div className="text-center max-w-md mx-auto px-6">
      <div className="text-red-500 text-xl font-semibold mb-6">{error}</div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          to="/all-blogs"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blogs
        </Link>
        <Link 
          to="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
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
  <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50">
    <div className="max-w-6xl mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            to="/all-blogs"
            className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blogs
          </Link>
          <div className="hidden sm:block w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
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

// Blog badges component
const BlogBadges = ({ isFeatured, viewsCount }) => (
  <div className="absolute top-6 right-6 flex flex-col gap-2">
    {isFeatured && (
      <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
        <Sparkles className="w-3 h-3" />
        Featured
      </div>
    )}
    {viewsCount > 1000 && (
      <div className="flex items-center gap-1 bg-gradient-to-r from-green-400 to-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
        <TrendingUp className="w-3 h-3" />
        Trending
      </div>
    )}
  </div>
);

// Blog stats component with enhanced design
const BlogStats = ({ blog, likesCount, isLiked, onLike }) => (
  <div className="flex items-center flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-400 mb-8">
    <div className="flex items-center gap-2">
      <Calendar className="w-4 h-4 text-purple-500" />
      <span className="font-medium">{new Date(blog.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })}</span>
    </div>
    <div className="flex items-center gap-2">
      <Clock className="w-4 h-4 text-blue-500" />
      <span className="font-medium">{blog.read_count} reads</span>
    </div>
    <div className="flex items-center gap-2">
      <User className="w-4 h-4 text-green-500" />
      <span className="font-medium">{blog.author}</span>
    </div>
    <div className="flex items-center gap-2">
      <Eye className="w-4 h-4 text-indigo-500" />
      <span className="font-medium">{blog.views_count.toLocaleString()}</span>
    </div>
    <div className="flex items-center gap-2">
      <button
        onClick={onLike}
        className={`focus:outline-none transition-all duration-200 p-1 rounded-full ${
          isLiked 
            ? 'text-red-500 scale-110 bg-red-50 dark:bg-red-900/30' 
            : 'text-gray-500 dark:text-gray-400 hover:text-red-500 hover:scale-105 hover:bg-red-50 dark:hover:bg-red-900/20'
        }`}
        aria-label={isLiked ? 'Unlike post' : 'Like post'}
      >
        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
      </button>
      <span className="font-medium">{likesCount.toLocaleString()}</span>
    </div>
  </div>
);

// Enhanced tags component
const TagList = ({ tags }) => (
  <div className="flex flex-wrap gap-3 mb-8">
    {tags.map((tag) => (
      <span 
        key={tag} 
        className="text-sm px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 font-medium border border-purple-200/50 dark:border-purple-700/50 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
      >
        #{tag}
      </span>
    ))}
  </div>
);

// Main component
export default function BlogDetail() {
  const { slug } = useParams();
  const { blog, isLoading, error } = useBlogData(slug);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Update likes count when blog loads
  useEffect(() => {
    if (blog) {
      setLikesCount(blog.likes_count);
    }
  }, [blog]);

  const handleLike = useCallback(async () => {
    try {
      const response = await likeBlogPost(slug);
      if (response.status === 'liked' || response.status === 'already_liked') {
        setLikesCount(response.likes_count);
        setIsLiked(true);
      }
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  }, [slug]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share was cancelled');
      }
    } else {
      // Fallback: copy URL to clipboard
      await navigator.clipboard.writeText(window.location.href);
      // You might want to show a toast notification here
    }
  }, [blog]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  const tags = Array.isArray(blog.tags)
    ? blog.tags
    : typeof blog.tags === 'string'
      ? JSON.parse(blog.tags || '[]')
      : [];

  const imageUrl = blog.featured_image
    ? blog.featured_image.startsWith('http')
      ? blog.featured_image
      : `${BACKEND_URL}${blog.featured_image}`
    : 'https://via.placeholder.com/600x400?text=No+Image';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Navigation Header */}
      <NavigationHeader />

      {/* Main Content */}
      <main className="py-12 px-6 max-w-5xl mx-auto">
        <article className="relative overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
          {/* Hero image section with overlay */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
            <img
              src={imageUrl}
              alt={blog.title}
              className="w-full h-[500px] object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x500?text=Image+Not+Found';
              }}
            />
            <BlogBadges isFeatured={blog.is_featured} viewsCount={blog.views_count} />
          </div>

          {/* Content section */}
          <div className="p-8 lg:p-12">
            {/* Category */}
            <div className="mb-6">
              <span className="inline-block text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
                {blog.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-800 dark:text-white leading-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {blog.title}
            </h1>

            {/* Stats */}
            <BlogStats 
              blog={blog} 
              likesCount={likesCount} 
              isLiked={isLiked} 
              onLike={handleLike} 
            />

            {/* Excerpt */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 mb-8 border border-purple-200/50 dark:border-purple-700/50">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-medium italic">
                "{blog.excerpt}"
              </p>
            </div>

            {/* Content */}
            <div className="prose prose-lg dark:prose-invert mb-8 max-w-none prose-headings:text-purple-800 dark:prose-headings:text-purple-300 prose-a:text-purple-600 dark:prose-a:text-purple-400">
              {blog.content}
            </div>

            {/* Tags */}
            <TagList tags={tags} />

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4 pt-8 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
              >
                <Share2 className="w-4 h-4" />
                Share Article
              </button>
              
              <Link
                to="/all-blogs"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                More Articles
              </Link>
            </div>
          </div>
        </article>

        {/* Back to top button */}
        <div className="text-center mt-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 font-semibold text-lg"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
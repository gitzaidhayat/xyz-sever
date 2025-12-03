import { useState } from 'react';
import { FiCalendar, FiUser, FiArrowRight } from 'react-icons/fi';
import { subscribeEmail } from '../api/subscriptionApi';

const blogPosts = [
  {
    id: 1,
    title: "The Ultimate Guide to Styling Your Abaya",
    excerpt: "Discover the latest trends and tips on how to style your abaya for any occasion. From casual everyday wear to elegant evening looks.",
    image: "https://images.unsplash.com/photo-1583391733981-5acd513642e5?w=800",
    author: "Sarah Ahmed",
    date: "November 20, 2025",
    category: "Fashion Tips"
  },
  {
    id: 2,
    title: "Modest Fashion Trends for 2025",
    excerpt: "Explore the upcoming trends in modest fashion and how AbayaButh is leading the way in combining tradition with contemporary style.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800",
    author: "Fatima Khan",
    date: "November 15, 2025",
    category: "Trends"
  },
  {
    id: 3,
    title: "Choosing the Perfect Fabric for Your Abaya",
    excerpt: "Learn about different fabric types and how to choose the right one based on climate, occasion, and personal preference.",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea1c8c8e?w=800",
    author: "Amina Malik",
    date: "November 10, 2025",
    category: "Guide"
  },
  {
    id: 4,
    title: "Caring for Your Modest Wear Collection",
    excerpt: "Essential tips on maintaining and caring for your abayas to ensure they last longer and stay looking beautiful.",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800",
    author: "Zainab Hassan",
    date: "November 5, 2025",
    category: "Care Guide"
  },
  {
    id: 5,
    title: "Modest Fashion Around the World",
    excerpt: "A look at how modest fashion varies across different cultures and regions, celebrating diversity in style.",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800",
    author: "Mariam Ali",
    date: "October 28, 2025",
    category: "Culture"
  },
  {
    id: 6,
    title: "Accessorizing Your Abaya: Do's and Don'ts",
    excerpt: "Master the art of accessorizing your abaya with hijabs, jewelry, and bags to create stunning looks.",
    image: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=800",
    author: "Ayesha Rahman",
    date: "October 20, 2025",
    category: "Styling"
  }
];

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const categories = ['All', 'Fashion Tips', 'Trends', 'Guide', 'Care Guide', 'Culture', 'Styling'];
  
  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const validateEmail = (value) => /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!validateEmail(trimmed)) {
      setStatus({ type: 'error', message: 'Please enter a valid email.' });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const res = await subscribeEmail(trimmed);
      if (res.success) {
        setStatus({ type: 'success', message: res.message || 'Subscribed successfully!' });
        setEmail('');
        setTimeout(() => setStatus(null), 5000);
      } else {
        setStatus({ type: 'error', message: res.message || 'Subscription failed.' });
      }
    } catch (err) {
      console.error('Subscription error:', err);
      const msg = err?.response?.data?.message || 'Server error. Please try again later.';
      setStatus({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest fashion tips, trends, and insights from the world of modest fashion.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-teal-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 hover:text-teal-600 cursor-pointer">
                  {post.title}
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-2">
                    <FiUser className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCalendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                </div>
                
                <button className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium">
                  Read More
                  <FiArrowRight className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-16 bg-[#00242A] text-white pt-12 pb-10 rounded-lg px-4 text-center">
          <h2 className="tracking-wide font-medium text-lg md:text-xl mb-3">SUBSCRIBE TO OUR NEWSLETTER</h2>
          <p className="text-sm md:text-base text-gray-200 mb-8">
            Get the latest blog posts and fashion tips delivered directly to your inbox.
          </p>
          <form onSubmit={handleSubmit} className="flex max-w-3xl mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              aria-label="Email address"
              disabled={loading}
              className="flex-1 px-6 py-4 bg-white text-black text-sm focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-4 cursor-pointer text-sm font-medium transition-colors ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#eec9af] text-black hover:bg-[#e3b798]'
              }`}
            >
              {loading ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
            </button>
          </form>
          {status && (
            <div className={`mt-3 text-xs md:text-sm mx-auto w-fit px-4 py-2 rounded-md ${
              status.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}>
              {status.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;

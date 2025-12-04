'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { Listing } from '@/types/auth';
import { listingAPI } from '@/lib/api';


export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { name: 'Textbooks', icon: '📚', count: '150+' },
    { name: 'Electronics', icon: '💻', count: '80+' },
    { name: 'Furniture', icon: '🛋️', count: '45+' },
    { name: 'Clothing', icon: '👕', count: '120+' },
    { name: 'Supplies', icon: '✏️', count: '200+' },
    { name: 'Sports', icon: '⚽', count: '60+' },
  ];

  const priceOptions = [
    { value: '0-25', label: 'Under $25' },
    { value: '25-50', label: '$25 - $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '100-500', label: '$100 - $500' },
    { value: '500+', label: '$500+' },
  ];

  const [recentListings, setRecentListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await listingAPI.getListings();
        // Keep backend format and rely on Listing type fields
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedListings: Listing[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          photo_url: item.photo_url,
          seller_id: item.seller_id,
          seller: item.seller,
          is_sold: item.is_sold,
          category: item.category,
          description: item.description,
          location: item.location,
        }));
        setRecentListings(mappedListings);
      } catch (error) {
        console.error('Failed to fetch listings:', error);
        // Set empty listings on error instead of showing error
        setRecentListings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      globalThis.location.href = `/marketplace?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100" suppressHydrationWarning>
      {/* Hero Section */}
      <div className={`${isAuthenticated ? 'bg-gradient-to-r from-indigo-50 to-blue-50' : 'bg-gradient-to-r from-indigo-600 to-blue-700 text-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          {!isAuthenticated && (
            <>
              {/* Decorative floating shapes - only for non-authenticated */}
              <div aria-hidden className="absolute -left-8 -top-8 w-72 h-72 rounded-full bg-blue-400/30 filter blur-3xl opacity-70 motion-safe:animate-float" />
              <div aria-hidden className="absolute -right-12 -top-12 w-56 h-56 rounded-full bg-indigo-400/20 filter blur-2xl opacity-70 motion-safe:animate-float" />
              <div aria-hidden className="absolute left-1/2 -bottom-8 transform -translate-x-1/2 w-96 h-96 rounded-full bg-blue-200/20 filter blur-3xl opacity-60 motion-safe:animate-float" />
            </>
          )}
          <div className="text-center">
            {/* Captivating Hero Section */}
            <div className="mb-12 space-y-4 motion-safe:animate-float">
              {isAuthenticated && user ? (
                <>
                  <h1 className={`text-5xl sm:text-6xl md:text-7xl font-extrabold ${isAuthenticated ? 'text-gray-900' : 'bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent'}`}>
                    Welcome back, <span className="text-indigo-600">{user.name}!</span>
                  </h1>
                  <p className="text-gray-600 text-xl max-w-2xl mx-auto">
                    Continue browsing great deals from your campus
                  </p>
                </>
              ) : (
                <>
                  <p className="text-blue-200 text-lg font-semibold tracking-widest uppercase">Welcome to Your Campus Hub</p>
                  <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                    Find Anything, Anytime
                  </h1>
                  <p className="text-blue-100 text-xl max-w-2xl mx-auto">
                    Connect with students. Discover deals. Build your campus community.
                  </p>
                </>
              )}
            </div>

            {/* Search Bar */}
            <div className="w-full px-4 sm:px-6 lg:px-8 mb-12">
              <div className="max-w-6xl mx-auto space-y-4">
                <form onSubmit={handleQuickSearch} className="relative motion-safe:animate-float flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search textbooks, electronics, furniture..."
                    aria-label="Search marketplace"
                    className={`flex-1 px-8 py-5 rounded-xl text-lg shadow-2xl focus:outline-none focus:ring-4 border ${
                      isAuthenticated
                        ? 'bg-white/95 text-gray-900 placeholder-gray-400 border-white/20 focus:ring-indigo-300'
                        : 'bg-white/95 text-gray-900 placeholder-gray-400 border-white/20 focus:ring-blue-300'
                    }`}
                  />
                  <button
                    type="submit"
                    className={`font-bold px-6 py-5 rounded-lg transition-all transform hover:scale-105 shadow-lg ${
                      isAuthenticated
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-300 text-gray-900 hover:bg-gray-400'
                    }`}
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`font-bold px-6 py-5 rounded-lg transition-all transform hover:scale-105 shadow-lg ${
                      isAuthenticated
                        ? 'bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-200'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    ⚙️ Filter
                  </button>
                </form>

                {/* Filter Dropdown */}
                {showFilters && (
                  <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6 space-y-4 motion-safe:animate-float">
                    {/* Category Filter */}
                    <fieldset>
                      <legend className="text-sm font-semibold text-gray-900 mb-3">Category</legend>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                        <button
                          onClick={() => setSelectedCategory('')}
                          className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                            selectedCategory === ''
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          All
                        </button>
                        {categories.map((cat) => (
                          <button
                            key={cat.name}
                            onClick={() => setSelectedCategory(cat.name)}
                            className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                              selectedCategory === cat.name
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {cat.icon} {cat.name}
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    {/* Price Filter */}
                    <fieldset>
                      <legend className="text-sm font-semibold text-gray-900 mb-3">Price Range</legend>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                        <button
                          onClick={() => setPriceRange('')}
                          className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                            priceRange === ''
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Any
                        </button>
                        {priceOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setPriceRange(option.value)}
                            className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                              priceRange === option.value
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    {/* Apply Filters Button */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          const params = new URLSearchParams();
                          if (searchQuery) params.append('q', searchQuery);
                          if (selectedCategory) params.append('category', selectedCategory);
                          if (priceRange) params.append('price', priceRange);
                          globalThis.location.href = `/marketplace?${params.toString()}`;
                        }}
                        className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-all"
                      >
                        Apply Filters
                      </button>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-all"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Display */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6 sm:p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Explore Products</h2>
              <p className="text-gray-500 mt-1">Recently posted items from students near you</p>
            </div>
            <Link
              href="/marketplace"
              className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 hover:gap-2 transition-all"
            >
              View All <span className="text-xl">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                Loading products...
              </div>
            ) : (
              recentListings.map((item) => {
                if (isAuthenticated) {
                  // Authenticated users - clickable link to listing details
                  return (
                    <Link
                      key={item.id}
                      href={`/listings/${item.id}`}
                      className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-white/30 duration-300 group block motion-safe:animate-float"
                    >
                      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 h-48 flex items-center justify-center text-7xl group-hover:scale-105 transition-transform duration-300">
                        {item.photo_url ? (
                          <img src={item.photo_url} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-7xl">📦</div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-xl group-hover:text-indigo-600 transition-colors">
                          {item.title}
                        </h3>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-2xl font-extrabold text-indigo-600">
                            ${item.price}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-base rounded-full font-medium uppercase tracking-wide">
                            {item.is_sold ? 'Sold' : 'Available'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-4 text-base text-gray-500">
                          <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-base font-bold text-indigo-600">
                            {item.seller?.name?.charAt(0) || String(item.seller_id)?.charAt(0) || 'S'}
                          </div>
                          {item.seller?.name || `Seller #${item.seller_id}`}
                        </div>
                        {item.location && (
                          <div className="flex items-center gap-2 mb-3 text-sm text-indigo-600 font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                            <span className="truncate">{item.location}</span>
                          </div>
                        )}
                        <div className="w-full bg-white border-2 border-indigo-600 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white font-bold py-2 rounded-lg transition-all duration-200 text-center">
                          View Details
                        </div>
                      </div>
                    </Link>
                  );
                } else {
                  // Unauthenticated users - read-only product cards with overlay
                  return (
                    <Link
                      key={item.id}
                      href={`/listings/${item.id}`}
                      className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-white/30 duration-300 group block motion-safe:animate-float cursor-pointer relative"
                    >
                      {/* Sign in overlay for unauthenticated users */}
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-10 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-xl flex-col gap-3">
                        <p className="text-white font-bold text-lg">View as Guest</p>
                        <button className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors">
                          Sign In
                        </button>
                      </div>
                      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 h-48 flex items-center justify-center text-7xl group-hover:scale-105 transition-transform duration-300">
                        {item.photo_url ? (
                          <img src={item.photo_url} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-7xl">📦</div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-xl group-hover:text-indigo-600 transition-colors">
                          {item.title}
                        </h3>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-2xl font-extrabold text-indigo-600">
                            ${item.price}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-base rounded-full font-medium uppercase tracking-wide">
                            {item.is_sold ? 'Sold' : 'Available'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-4 text-base text-gray-500">
                          <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-base font-bold text-indigo-600">
                            {item.seller?.name?.charAt(0) || String(item.seller_id)?.charAt(0) || 'S'}
                          </div>
                          {item.seller?.name || `Seller #${item.seller_id}`}
                        </div>
                        {item.location && (
                          <div className="flex items-center gap-2 mb-3 text-sm text-indigo-600 font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                            <span className="truncate">{item.location}</span>
                          </div>
                        )}
                        <div className="w-full bg-gray-300 text-gray-600 font-bold py-2 rounded-lg text-center opacity-75 cursor-not-allowed">
                          View Details
                        </div>
                      </div>
                    </Link>
                  );
                }
              })
            )}
          </div>
        </div>
      </div>

      {/* Showcase for non-authenticated users - only shown if not authenticated */}
      {!isAuthenticated && (
        <>
          {/* What We Offer Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6 sm:p-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                  What We Offer
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Campify is the premier marketplace built by students, for students. Buy, sell, and connect with your campus community.
                </p>
              </div>

              {/* Offerings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {/* Offering 1 */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 border border-indigo-200/50 hover:shadow-xl transition-all duration-300">
                  <div className="text-5xl mb-4">📚</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Diverse Products</h3>
                  <p className="text-gray-700 leading-relaxed">
                    From textbooks and electronics to furniture and clothing, find everything you need for campus life. Over 600+ items listed daily.
                  </p>
                </div>

                {/* Offering 2 */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-200/50 hover:shadow-xl transition-all duration-300">
                  <div className="text-5xl mb-4">💰</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Unbeatable Prices</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Save up to 70% compared to retail prices. Students helping students means better deals for everyone. Direct peer-to-peer transactions.
                  </p>
                </div>

                {/* Offering 3 */}
                <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl p-8 border border-cyan-200/50 hover:shadow-xl transition-all duration-300">
                  <div className="text-5xl mb-4">🚀</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Easy & Fast</h3>
                  <p className="text-gray-700 leading-relaxed">
                    List items in seconds. Communicate through our built-in chat. Arrange meetups on campus. Secure payments and verified student accounts.
                  </p>
                </div>
              </div>

              {/* How It Works */}
              <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl p-8 text-white">
                <h3 className="text-3xl font-bold mb-8 text-center">How It Works</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
                    <h4 className="font-bold text-lg mb-2">Sign Up</h4>
                    <p className="text-blue-100 text-sm">Create account with your .edu email</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
                    <h4 className="font-bold text-lg mb-2">Browse</h4>
                    <p className="text-blue-100 text-sm">Explore 600+ products from verified sellers</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
                    <h4 className="font-bold text-lg mb-2">Chat</h4>
                    <p className="text-blue-100 text-sm">Message sellers and arrange details</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">4</div>
                    <h4 className="font-bold text-lg mb-2">Buy/Sell</h4>
                    <p className="text-blue-100 text-sm">Complete transactions on your terms</p>
                  </div>
                </div>
              </div>

              {/* CTA for Sign Up */}
              <div className="text-center mt-12">
                <p className="text-gray-600 text-lg mb-6">Ready to join thousands of students saving money?</p>
                <Link
                  href="/auth/signup"
                  className="inline-block px-10 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-lg"
                >
                  Get Started Now
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-8 text-center border border-indigo-200">
                <div className="text-5xl font-extrabold text-indigo-600 mb-2">5K+</div>
                <p className="text-gray-700 font-semibold">Active Users</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center border border-blue-200">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">600+</div>
                <p className="text-gray-700 font-semibold">Products Listed</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl p-8 text-center border border-cyan-200">
                <div className="text-5xl font-extrabold text-cyan-600 mb-2">$2M</div>
                <p className="text-gray-700 font-semibold">Saved by Students</p>
              </div>
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-8 text-center border border-teal-200">
                <div className="text-5xl font-extrabold text-teal-600 mb-2">98%</div>
                <p className="text-gray-700 font-semibold">Satisfied Buyers</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Group 2: Info Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6 sm:p-8">
          {/* Features Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why Choose Campify?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6 bg-white/70 backdrop-blur-lg rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-white/40 motion-safe:animate-float">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                  <span className="text-3xl">🎓</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Campus Only
                </h3>
                <p className="text-gray-600">
                  Exclusive to verified college students with .edu email addresses
                </p>
              </div>

              <div className="text-center p-6 bg-white/70 backdrop-blur-lg rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-white/40 motion-safe:animate-float">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                  <span className="text-3xl">💬</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Easy Chat
                </h3>
                <p className="text-gray-600">
                  Built-in messaging to negotiate and arrange meetups
                </p>
              </div>

              <div className="text-center p-6 bg-white/70 backdrop-blur-lg rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-white/40 motion-safe:animate-float">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                  <span className="text-3xl">🤖</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  AI Search
                </h3>
                <p className="text-gray-600">
                  Natural language search powered by ChatGPT - just ask!
                </p>
              </div>

              <div className="text-center p-6 bg-white/70 backdrop-blur-lg rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-white/40 motion-safe:animate-float">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                  <span className="text-3xl">🛡️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Safe & Moderated
                </h3>
                <p className="text-gray-600">
                  Admin moderation and reporting system for safety
                </p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-white text-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
                <p className="text-indigo-100">
                  Create your account with your college email address
                </p>
              </div>

              <div className="text-center">
                <div className="bg-white text-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Post or Browse</h3>
                <p className="text-indigo-100">
                  List items to sell or search for what you need
                </p>
              </div>

              <div className="text-center">
                <div className="bg-white text-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Chat & Trade</h3>
                <p className="text-indigo-100">
                  Message sellers, negotiate, and complete your transaction
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Campify</h3>
              <p className="text-gray-400">
                The trusted platform for college students to buy and sell within their campus community.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>• AI-Powered Search</li>
                <li>• In-App Messaging</li>
                <li>• Photo Uploads</li>
                <li>• Safe & Moderated</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>• How to Buy</li>
                <li>• How to Sell</li>
                <li>• Safety Guidelines</li>
                <li>• Contact Admin</li>
              </ul>
            </div>
          </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 Campify - CMPE 202 Team Project by Visionary Coders</p>
          </div>
        </div>
      </div>
    </div>
  );
}

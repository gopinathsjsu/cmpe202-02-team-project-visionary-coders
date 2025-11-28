'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { listingAPI } from '@/lib/api';

interface Listing {
  id: number;
  title: string;
  price: string;
  image: string;
  seller: string;
  condition: string;
}

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');



  const categories = [
    { name: 'Textbooks', icon: '📚', count: '150+' },
    { name: 'Electronics', icon: '💻', count: '80+' },
    { name: 'Furniture', icon: '🛋️', count: '45+' },
    { name: 'Clothing', icon: '👕', count: '120+' },
    { name: 'Supplies', icon: '✏️', count: '200+' },
    { name: 'Sports', icon: '⚽', count: '60+' },
  ];

  const [recentListings, setRecentListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await listingAPI.getListings();
        // Map backend data to frontend format
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedListings = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          price: `$${item.price}`,
          image: item.photo_url || '📦',
          seller: `Seller #${item.seller_id}`, // Backend only gives ID for now
          condition: 'Good', // Backend doesn't have condition field yet
        }));
        setRecentListings(mappedListings);
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/marketplace?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold mb-6 sm:text-6xl md:text-7xl">
              Campus Marketplace
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-indigo-100">
              Buy and sell textbooks, gadgets, and essentials within your campus community
            </p>
            <p className="text-lg mb-10 text-indigo-100">
              🎓 Students Only • 🛡️ Safe & Secure • 💬 Easy Chat • 📱 Simple Listings
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto mb-8">
              <form onSubmit={handleQuickSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ask anything... e.g., 'Do you have a textbook for CMPE 202?'"
                  className="w-full px-6 py-4 rounded-full text-gray-900 text-lg shadow-2xl focus:outline-none focus:ring-4 focus:ring-yellow-400 bg-white placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-8 py-3 rounded-full transition-colors"
                >
                  🔍 Search
                </button>
              </form>
              <p className="text-sm text-indigo-200 mt-3">
                ✨ Powered by AI - Ask in plain English and find what you need!
              </p>
            </div>

            {/* CTA Buttons */}
            {isAuthenticated ? (
              <div className="flex justify-center gap-4 flex-wrap">
                <Link
                  href="/marketplace"
                  className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-full shadow-lg hover:bg-gray-100 transition-all transform hover:scale-105"
                >
                  Browse Marketplace
                </Link>
                <Link
                  href="/listings/create"
                  className="px-8 py-4 bg-yellow-400 text-gray-900 font-bold rounded-full shadow-lg hover:bg-yellow-500 transition-all transform hover:scale-105"
                >
                  + Sell Something
                </Link>
              </div>
            ) : (
              <div className="flex justify-center gap-4 flex-wrap">
                <Link
                  href="/auth/signup"
                  className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-full shadow-lg hover:bg-gray-100 transition-all transform hover:scale-105"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/auth/signin"
                  className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-indigo-600 transition-all transform hover:scale-105"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Group 1: Discovery Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6 sm:p-8">
          {/* Categories Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Browse by Category
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={`/marketplace?category=${category.name.toLowerCase()}`}
                  className="bg-white/80 rounded-xl p-6 text-center transition-all cursor-pointer border border-transparent hover:border-indigo-200 hover:bg-white"
                >
                  <div className="text-5xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.count} items</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Listings */}
          <div className="bg-white/50 rounded-3xl p-6 sm:p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Fresh Finds</h2>
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
                  Loading fresh finds...
                </div>
              ) : (
                recentListings.map((item) => (
                  <Link
                    key={item.id}
                    href={`/listings/${item.id}`}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-gray-100 group block"
                  >
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 h-48 flex items-center justify-center text-7xl group-hover:scale-105 transition-transform duration-300">
                      {item.image}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-lg group-hover:text-indigo-600 transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-extrabold text-indigo-600">
                          {item.price}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium uppercase tracking-wide">
                          {item.condition}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                        <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-bold text-indigo-600">
                          {item.seller.charAt(0)}
                        </div>
                        {item.seller}
                      </div>
                      <div className="w-full bg-white border-2 border-indigo-600 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white font-bold py-2 rounded-lg transition-all duration-200 text-center">
                        View Details
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Group 2: Info Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6 sm:p-8">
          {/* Features Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why Choose Campus Marketplace?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6 bg-white/60 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎓</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Campus Only
                </h3>
                <p className="text-gray-600">
                  Exclusive to verified college students with .edu email addresses
                </p>
              </div>

              <div className="text-center p-6 bg-white/60 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💬</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Easy Chat
                </h3>
                <p className="text-gray-600">
                  Built-in messaging to negotiate and arrange meetups
                </p>
              </div>

              <div className="text-center p-6 bg-white/60 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🤖</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  AI Search
                </h3>
                <p className="text-gray-600">
                  Natural language search powered by ChatGPT - just ask!
                </p>
              </div>

              <div className="text-center p-6 bg-white/60 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
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
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-3xl p-6 sm:p-8 shadow-lg">
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

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-indigo-600 mb-2">500+</div>
            <p className="text-gray-600">Active Listings</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-indigo-600 mb-2">1,200+</div>
            <p className="text-gray-600">Students</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-indigo-600 mb-2">850+</div>
            <p className="text-gray-600">Items Sold</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-indigo-600 mb-2">4.8/5</div>
            <p className="text-gray-600">User Rating</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ready to Start Trading?
            </h2>
            <p className="text-xl text-gray-800 mb-8">
              Join your campus community and discover great deals today!
            </p>
            <Link
              href="/auth/signup"
              className="inline-block px-10 py-4 bg-gray-900 text-white font-bold rounded-full shadow-xl hover:bg-gray-800 transition-all transform hover:scale-105"
            >
              Sign Up Now - It&apos;s Free! 🚀
            </Link>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Campus Marketplace</h3>
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
            <p>© 2025 Campus Marketplace - CMPE 202 Team Project by Visionary Coders</p>
          </div>
        </div>
      </div>
    </div>
  );
}

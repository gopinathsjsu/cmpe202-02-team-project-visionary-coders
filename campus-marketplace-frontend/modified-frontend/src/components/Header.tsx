'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { chatAPI } from '@/lib/api';

export default function Header() {
  const { user, signOut, isAuthenticated } = useAuth();
  const router = useRouter();
  const [chatCount, setChatCount] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchChatCount = async () => {
        try {
          const rooms = await chatAPI.getRooms();
          // Get viewed chats from localStorage
          const viewedChats = JSON.parse(localStorage.getItem('viewedChats') || '[]');
          // Count only unviewed chats
          const unreadCount = rooms.filter((room: any) => !viewedChats.includes(room.id)).length;
          setChatCount(unreadCount);
        } catch (err) {
          // Silently fail - chat feature might not be available yet
        }
      };

      fetchChatCount();

      // Listen for chat viewed event to update count
      const handleChatViewed = () => {
        fetchChatCount();
      };

      globalThis.addEventListener('chatViewed', handleChatViewed);

      // Refresh chat count every 30 seconds
      const interval = setInterval(fetchChatCount, 30000);

      return () => {
        clearInterval(interval);
        globalThis.removeEventListener('chatViewed', handleChatViewed);
      };
    }
  }, [isAuthenticated]);

  // Handle clicks outside profile menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isProfileOpen]);

  return (
    <header className="bg-slate-900 border-b border-white/10 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-4 sm:px-6 lg:px-8 py-6">

        {/* Left Section: Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-white hover:text-cyan-300 transition-colors">
            <span className="text-cyan-400 font-black text-3xl">Campify</span>
          </Link>
          <Link
            href="/marketplace"
            className="text-white hover:text-cyan-400 font-semibold transition-colors"
          >
            Browse Marketplace
          </Link>
        </div>

        {/* Right Section: Sign In / Profile */}
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <>
              {/* Sell New Item Button */}
              {/* Sell New Item Button */}
              {user.role === 'seller' && (
                <Link
                  href="/listings/create"
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all"
                >
                  + Sell
                </Link>
              )}

              {/* Cart Icon */}
              <Link
                href="/dashboard/purchases"
                className="relative group p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-white hover:text-cyan-400 transition-colors"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.622 0 1.18.307 1.462.841l2.298 5.465a.75.75 0 001.275-.06L9.06 3.75a.75.75 0 01.72-.548h7.313a.75.75 0 01.721.548l2.038 7.446a.75.75 0 01-1.275.06l-2.299-5.465A2.25 2.25 0 0015.75 3H2.25z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 16.5a.75.75 0 00-.75.75v2.25a.75.75 0 00.75.75h19.5a.75.75 0 00.75-.75v-2.25a.75.75 0 00-.75-.75H2.25z"
                  />
                </svg>
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  My Cart
                </span>
              </Link>

              {/* Wishlist Icon */}
              <Link
                href="/profile/wishlist"
                className="relative group p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-white hover:text-cyan-400 transition-colors"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  My Wishlist
                </span>
              </Link>

              {/* Admin Panel Icon */}
              {user.role === 'admin' && (
                <Link
                  href="/admin/dashboard"
                  className="relative group p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-white hover:text-cyan-400 transition-colors"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                    />
                  </svg>
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Admin Panel
                  </span>
                </Link>
              )}

              {/* Chat Icon */}
              <Link
                href="/chat"
                className="relative group p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-white hover:text-cyan-400 transition-colors"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 00.865-.501c1.054-.086 2.294-.213 3.423-.379 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                  />
                </svg>
                {chatCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-base font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {chatCount > 9 ? '9+' : chatCount}
                  </span>
                )}
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Messages
                </span>
              </Link>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-11 h-11 rounded-full bg-cyan-500 flex items-center justify-center text-slate-900 font-bold text-base cursor-pointer hover:shadow-lg hover:shadow-cyan-500/50 transition-all hover:scale-110"
                >
                  {user.name.charAt(0).toUpperCase()}
                </button>
                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute top-full right-0 mt-3 w-72 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="bg-slate-700 rounded-2xl shadow-2xl border border-white/30 py-4 backdrop-blur-md transform transition-all">
                      {/* User Info Section */}
                      <div className="px-6 py-5 border-b border-white/20 bg-slate-600 rounded-t-2xl">
                        <p className="text-base text-white/70 uppercase tracking-widest font-bold mb-2">Logged in as</p>
                        <p className="font-bold text-xl text-white truncate">{user.name}</p>
                        <p className="text-base text-white/70 truncate mt-1">{user.email}</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="px-2 py-3 space-y-1">
                        <Link
                          href="/profile/view"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 w-full text-left px-4 py-3 text-base text-white hover:bg-white/15 transition-colors font-medium rounded-lg"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 flex-shrink-0 text-cyan-400"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                            />
                          </svg>
                          <span>View Profile</span>
                        </Link>

                        <Link
                          href="/profile/edit"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 w-full text-left px-4 py-3 text-base text-white hover:bg-white/15 transition-colors font-medium rounded-lg"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 flex-shrink-0 text-cyan-400"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 9.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                            />
                          </svg>
                          <span>Update Profile</span>
                        </Link>

                        <Link
                          href="/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 w-full text-left px-4 py-3 text-base text-white hover:bg-white/15 transition-colors font-medium rounded-lg"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 flex-shrink-0 text-cyan-400"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a6.001 6.001 0 00119.364 0m0 0V9.35m0 0A6 6 0 1021.75 15h-1.355A6 6 0 002.25 15h-1.32z"
                            />
                          </svg>
                          <span>Your Listings</span>
                        </Link>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-white/20 my-2"></div>

                      {/* Sign Out Button */}
                      <div className="px-2">
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            signOut();
                          }}
                          className="flex items-center gap-3 w-full text-left px-4 py-3 text-base text-red-300 hover:bg-red-500/20 transition-colors font-medium rounded-lg"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 flex-shrink-0"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3-3l3-3m0 0l-3-3m3 3H9"
                            />
                          </svg>
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/signup"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                Sign Up
              </Link>
              <Link
                href="/auth/signin"
                className="px-6 py-3 rounded-lg text-white font-bold border border-white/30 hover:bg-white/10 transition-all"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}

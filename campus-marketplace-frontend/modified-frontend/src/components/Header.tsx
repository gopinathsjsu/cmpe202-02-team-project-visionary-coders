'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function Header() {
  const { user, signOut, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = (path: string) => pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/marketplace?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="py-6 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto flex flex-wrap lg:flex-nowrap items-center justify-between gap-4">

        {/* Left Section: Brand & User Actions */}
        <div className="flex items-center gap-3 order-1 flex-grow lg:flex-grow-0 lg:w-auto">
          <div className="bg-white rounded-full px-2 py-2 pl-4 flex items-center gap-4 border border-gray-100">
            <Link href="/" className="flex items-center gap-2 font-bold text-gray-900 mr-2">
              <span className="text-indigo-600 text-xl">❖</span>
              <span className="hidden sm:inline">Marketplace</span>
            </Link>

            <div className="flex items-center gap-1">
              <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.996.91 1.898 1.78 2.496 2.41.397 4.73-.044 6.546-2.436M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              </button>

              {isAuthenticated && user ? (
                <div className="ml-1 relative group pb-2 -mb-2">
                  <Link href="/profile">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs cursor-pointer">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </Link>
                  {/* Dropdown for Sign Out */}
                  <div className="absolute top-full right-0 mt-0 pt-2 w-32 hidden group-hover:block z-50">
                    <div className="bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                      <Link href="/profile" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Profile
                      </Link>
                      <button onClick={signOut} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/auth/signin" className="ml-1 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-300 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Center Section: Navigation Pills */}
        <nav className="bg-white rounded-full p-2 flex items-center justify-center border border-gray-100 overflow-x-auto max-w-full order-2 lg:order-2 w-auto lg:w-auto">
          <Link
            href="/dashboard"
            className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap ${isActive('/dashboard') ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <Link
            href="/marketplace"
            className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap ${isActive('/marketplace') ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
            <span className="hidden sm:inline">Products</span>
          </Link>



          {(user?.role === 'admin' || user?.role === 'seller') && (
            <>
              <Link
                href="/listings/create"
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap ${isActive('/listings/create') ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.996.91 1.898 1.78 2.496 2.41.397 4.73-.044 6.546-2.436M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                <span className="hidden sm:inline">Marketing</span>
              </Link>

              <Link
                href="#"
                className="px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-all whitespace-nowrap cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                </svg>
                <span className="hidden sm:inline">Analytics</span>
              </Link>
            </>
          )}
        </nav>

        {/* Right Section: Search */}
        {pathname !== '/' && (
          <div className="w-full lg:w-auto flex-grow lg:max-w-md order-3 lg:order-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Anything..."
                className="w-full pl-10 pr-4 py-4 bg-white border border-gray-100 rounded-full text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </form>
          </div>
        )}

      </div>
    </header>
  );
}

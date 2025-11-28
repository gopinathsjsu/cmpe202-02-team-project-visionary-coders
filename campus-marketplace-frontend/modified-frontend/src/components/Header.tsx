'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user, signOut, isAuthenticated } = useAuth();

  return (
    <header className="bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-indigo-600 flex items-center gap-2">
                <span className="text-2xl">🛒</span>
                Campus Marketplace
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                <span className="text-sm text-gray-700">
                  Welcome, <span className="font-medium">{user.name}</span>
                  {user.role === 'admin' && (
                    <span className="ml-2 px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full">
                      Admin
                    </span>
                  )}
                </span>
                
                {user.role === 'admin' ? (
                  <Link
                    href="/admin/dashboard"
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                )}

                <button
                  onClick={signOut}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

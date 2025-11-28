'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Your Dashboard
            </h1>
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Full name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user?.name}</dd>
                </div>
                
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Email address</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
                </div>
                
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Account type</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{user?.role}</dd>
                </div>
                
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Member since</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-indigo-900">My Courses</h3>
                  <p className="mt-2 text-sm text-indigo-700">View and manage your enrolled courses</p>
                  <button className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    Go to courses →
                  </button>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-green-900">Assignments</h3>
                  <p className="mt-2 text-sm text-green-700">Check your pending assignments</p>
                  <button className="mt-4 text-sm font-medium text-green-600 hover:text-green-500">
                    View assignments →
                  </button>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-yellow-900">Resources</h3>
                  <p className="mt-2 text-sm text-yellow-700">Access learning materials and resources</p>
                  <button className="mt-4 text-sm font-medium text-yellow-600 hover:text-yellow-500">
                    Browse resources →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

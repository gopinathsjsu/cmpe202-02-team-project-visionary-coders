'use client';

<<<<<<< HEAD
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { adminAPI } from '@/lib/api';
import { AdminSummary } from '@/types/admin';

const statConfig = [
  { label: 'Total Users', key: 'total_users', container: 'border-blue-100 bg-blue-50', accent: 'text-blue-700' },
  { label: 'Total Sellers', key: 'total_sellers', container: 'border-green-100 bg-green-50', accent: 'text-green-700' },
  { label: 'Total Admins', key: 'total_admins', container: 'border-purple-100 bg-purple-50', accent: 'text-purple-700' },
  { label: 'Total Listings', key: 'total_listings', container: 'border-indigo-100 bg-indigo-50', accent: 'text-indigo-700' },
  { label: 'Pending Listings', key: 'pending_listings', container: 'border-yellow-100 bg-yellow-50', accent: 'text-yellow-700' },
  { label: 'Approved Listings', key: 'approved_listings', container: 'border-emerald-100 bg-emerald-50', accent: 'text-emerald-700' },
  { label: 'Rejected Listings', key: 'rejected_listings', container: 'border-rose-100 bg-rose-50', accent: 'text-rose-700' },
  { label: 'Sold Items', key: 'sold_items', container: 'border-gray-100 bg-gray-50', accent: 'text-gray-700' },
] as const;

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await adminAPI.getSummary();
        setSummary(data);
      } catch (err: any) {
        setError(err.message || 'Unable to load dashboard metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const formattedDate = useMemo(() => {
    if (!summary?.generated_at) return '—';
    return new Date(summary.generated_at).toLocaleString();
  }, [summary]);
=======
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminDashboardPage() {
  const { user } = useAuth();
>>>>>>> origin/main

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
<<<<<<< HEAD
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Signed in as</p>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 text-sm bg-indigo-100 text-indigo-800 rounded-full font-medium block mb-1">
                  Administrator
                </span>
                <p className="text-xs text-gray-500">Last updated: {formattedDate}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
=======
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <span className="px-3 py-1 text-base bg-indigo-100 text-indigo-800 rounded-full font-medium">
                Administrator
              </span>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
>>>>>>> origin/main
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-base font-medium text-gray-500">Full name</dt>
                  <dd className="mt-1 text-base text-gray-900">{user?.name}</dd>
                </div>

                <div className="sm:col-span-1">
                  <dt className="text-base font-medium text-gray-500">Email address</dt>
                  <dd className="mt-1 text-base text-gray-900">{user?.email}</dd>
                </div>

                <div className="sm:col-span-1">
                  <dt className="text-base font-medium text-gray-500">Role</dt>
                  <dd className="mt-1 text-base text-gray-900 capitalize">{user?.role}</dd>
                </div>

                <div className="sm:col-span-1">
                  <dt className="text-base font-medium text-gray-500">Admin since</dt>
                  <dd className="mt-1 text-base text-gray-900">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </dd>
                </div>
              </dl>
            </div>
<<<<<<< HEAD
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Admin Statistics</h2>
              {loading && <p className="text-sm text-gray-500">Loading metrics...</p>}
            </div>
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {statConfig.map((stat) => (
                <div key={stat.key} className={`p-4 rounded-lg border ${stat.container}`}>
                  <p className={`text-sm font-medium ${stat.accent}`}>{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {summary ? summary[stat.key] : '—'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Admin Actions</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link href="/admin/users" className="bg-white border-2 border-indigo-200 hover:border-indigo-400 p-4 rounded-lg text-left transition-colors block">
                <h3 className="text-lg font-medium text-gray-900">Manage Users</h3>
                <p className="mt-2 text-sm text-gray-600">View, edit, and manage user accounts</p>
              </Link>

              <Link href="/admin/products" className="bg-white border-2 border-indigo-200 hover:border-indigo-400 p-4 rounded-lg text-left transition-colors block">
                <h3 className="text-lg font-medium text-gray-900">Manage Products</h3>
                <p className="mt-2 text-sm text-gray-600">Approve, mark sold, or remove listings</p>
              </Link>

              <Link href="/admin/approvals" className="bg-white border-2 border-yellow-200 hover:border-yellow-400 p-4 rounded-lg text-left transition-colors block">
                <h3 className="text-lg font-medium text-gray-900">Pending Approvals</h3>
                <p className="mt-2 text-sm text-gray-600">Review and approve new product listings</p>
              </Link>

              <Link href="/admin/reports" className="bg-white border-2 border-rose-200 hover:border-rose-400 p-4 rounded-lg text-left transition-colors block">
                <h3 className="text-lg font-medium text-gray-900">Reports & Analytics</h3>
                <p className="mt-2 text-sm text-gray-600">Resolve community reports quickly</p>
              </Link>

              <Link href="/admin/add-product" className="bg-white border-2 border-green-200 hover:border-green-400 p-4 rounded-lg text-left transition-colors block">
                <h3 className="text-lg font-medium text-gray-900">Add Product</h3>
                <p className="mt-2 text-sm text-gray-600">Create a new product listing</p>
              </Link>
=======

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Admin Statistics</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-medium text-blue-600">Total Users</p>
                      <p className="mt-2 text-3xl font-bold text-blue-900">1,234</p>
                    </div>
                    <div className="text-blue-500">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-medium text-green-600">Active Courses</p>
                      <p className="mt-2 text-3xl font-bold text-green-900">42</p>
                    </div>
                    <div className="text-green-500">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-medium text-yellow-600">Pending Reviews</p>
                      <p className="mt-2 text-3xl font-bold text-yellow-900">18</p>
                    </div>
                    <div className="text-yellow-500">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-medium text-purple-600">Admins</p>
                      <p className="mt-2 text-3xl font-bold text-purple-900">8</p>
                    </div>
                    <div className="text-purple-500">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Admin Actions</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <button className="bg-white border-2 border-indigo-200 hover:border-indigo-400 p-4 rounded-lg text-left transition-colors">
                  <h3 className="text-xl font-medium text-gray-900">Manage Users</h3>
                  <p className="mt-2 text-base text-gray-600">View, edit, and manage user accounts</p>
                </button>

                <button className="bg-white border-2 border-indigo-200 hover:border-indigo-400 p-4 rounded-lg text-left transition-colors">
                  <h3 className="text-xl font-medium text-gray-900">Course Management</h3>
                  <p className="mt-2 text-base text-gray-600">Create and manage courses and content</p>
                </button>

                <button className="bg-white border-2 border-indigo-200 hover:border-indigo-400 p-4 rounded-lg text-left transition-colors">
                  <h3 className="text-xl font-medium text-gray-900">Reports & Analytics</h3>
                  <p className="mt-2 text-base text-gray-600">View system reports and analytics</p>
                </button>

                <button className="bg-white border-2 border-indigo-200 hover:border-indigo-400 p-4 rounded-lg text-left transition-colors">
                  <h3 className="text-xl font-medium text-gray-900">System Settings</h3>
                  <p className="mt-2 text-base text-gray-600">Configure system-wide settings</p>
                </button>

                <button className="bg-white border-2 border-indigo-200 hover:border-indigo-400 p-4 rounded-lg text-left transition-colors">
                  <h3 className="text-xl font-medium text-gray-900">Email Management</h3>
                  <p className="mt-2 text-base text-gray-600">Manage college email domains</p>
                </button>

                <button className="bg-white border-2 border-indigo-200 hover:border-indigo-400 p-4 rounded-lg text-left transition-colors">
                  <h3 className="text-xl font-medium text-gray-900">Audit Logs</h3>
                  <p className="mt-2 text-base text-gray-600">View system activity and audit logs</p>
                </button>

                <a href="/admin/add-product" className="bg-white border-2 border-indigo-200 hover:border-indigo-400 p-4 rounded-lg text-left transition-colors block">
                  <h3 className="text-xl font-medium text-gray-900">Add Product</h3>
                  <p className="mt-2 text-base text-gray-600">Create a new product listing</p>
                </a>
              </div>
>>>>>>> origin/main
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

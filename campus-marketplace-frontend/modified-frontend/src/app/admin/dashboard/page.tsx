'use client';

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

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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
                  <dt className="text-sm font-medium text-gray-500">Role</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{user?.role}</dd>
                </div>

                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Admin since</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </dd>
                </div>
              </dl>
            </div>
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
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

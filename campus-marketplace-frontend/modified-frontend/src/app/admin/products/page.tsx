'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { adminAPI } from '@/lib/api';
import type { Listing } from '@/types/auth';

const statusOptions = [
  { label: 'All statuses', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
] as const;

export default function AdminProductsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMutating, setIsMutating] = useState(false);

  const filteredListings = useMemo(() => {
    if (!searchTerm.trim()) return listings;
    return listings.filter((listing) =>
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [listings, searchTerm]);

  const fetchListings = async () => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, string | number> = {};
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      const data = await adminAPI.getListings(params);
      setListings(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleUpdate = async (id: number, data: { status?: string; is_sold?: boolean }) => {
    try {
      setIsMutating(true);
      await adminAPI.updateListing(id, data);
      await fetchListings();
    } catch (err: any) {
      alert(err.message || 'Failed to update listing');
    } finally {
      setIsMutating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to remove this listing?')) return;
    try {
      setIsMutating(true);
      await adminAPI.deleteListing(id);
      setListings((prev) => prev.filter((listing) => listing.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete listing');
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Products</p>
                <h1 className="text-3xl font-bold text-gray-900">Manage Listings</h1>
              </div>
              <Link
                href="/admin/add-product"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Add Product
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Search</label>
                <input
                  type="text"
                  placeholder="Search by title or description..."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading listings...</div>
            ) : filteredListings.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No listings found for the selected filters.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredListings.map((listing) => (
                      <tr key={listing.id}>
                        <td className="px-4 py-4 text-sm">
                          <p className="font-semibold text-gray-900">{listing.title}</p>
                          <p className="text-gray-500 truncate max-w-xs">{listing.description}</p>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">#{listing.seller_id}</td>
                        <td className="px-4 py-4 text-sm font-semibold text-gray-900">${listing.price.toFixed(2)}</td>
                        <td className="px-4 py-4">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              listing.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : listing.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {listing.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {new Date(listing.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 text-right text-sm space-x-3">
                          {listing.status !== 'approved' && (
                            <button
                              onClick={() => handleUpdate(listing.id, { status: 'approved' })}
                              className="text-green-600 hover:text-green-800 disabled:opacity-50"
                              disabled={isMutating}
                            >
                              Approve
                            </button>
                          )}
                          {listing.status !== 'rejected' && (
                            <button
                              onClick={() => handleUpdate(listing.id, { status: 'rejected' })}
                              className="text-rose-600 hover:text-rose-800 disabled:opacity-50"
                              disabled={isMutating}
                            >
                              Reject
                            </button>
                          )}
                          {!listing.is_sold && (
                            <button
                              onClick={() => handleUpdate(listing.id, { is_sold: true })}
                              className="text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                              disabled={isMutating}
                            >
                              Mark sold
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(listing.id)}
                            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                            disabled={isMutating}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}


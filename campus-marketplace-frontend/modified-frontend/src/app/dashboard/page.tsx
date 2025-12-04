'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { listingAPI } from '@/lib/api';
import { Listing } from '@/types/auth';
import Link from 'next/link';
import { useEffect, useState } from 'react';


export default function DashboardPage() {
  const { user } = useAuth();
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const renderListingsContent = () => {
    if (loading) {
      return (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <p className="text-gray-500 text-center">Loading your listings...</p>
        </div>
      );
    }
    if (myListings.length > 0) {
      const handleDelete = async (id: number, title: string) => {
        if (confirm(`Are you sure you want to delete "${title}"?`)) {
          try {
            await listingAPI.deleteListing(id);
            setMyListings(myListings.filter(l => l.id !== id));
          } catch (error) {
            console.error('Failed to delete listing:', error);
            alert('Failed to delete listing');
          }
        }
      };

      return (
        <div className="space-y-3">
          {myListings.map((listing) => (
            <div key={listing.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all">
              <div className="flex items-center gap-4">
                <div className="flex-grow min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{listing.title}</h3>
                  <p className="text-gray-600 text-base">{listing.price}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`px-3 py-1 text-base font-semibold rounded-full ${listing.is_sold ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {listing.is_sold ? 'Sold' : 'Active'}
                  </span>
                  <Link href={`/listings/${listing.id}`} className="text-blue-600 hover:text-blue-700 font-medium text-base">
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(listing.id, listing.title)}
                    className="text-red-600 hover:text-red-700 font-medium text-base"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <p className="text-gray-600 mb-4 text-xl">No listings yet</p>
        {(user?.role === 'admin' || user?.role === 'seller') && (
          <Link
            href={user?.role === 'admin' ? "/admin/add-product" : "/listings/create"}
            className="inline-block px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create your first listing
          </Link>
        )}
      </div>
    );
  };

  useEffect(() => {
    const fetchMyListings = async () => {
      if (user?.id) {
        try {
          const data = await listingAPI.getListings({ seller_id: Number.parseInt(user.id, 10) });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mapped = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            price: `$${item.price}`,
            image: item.photo_url || '📦',
            is_sold: item.is_sold,
          }));
          setMyListings(mapped);
        } catch (error) {
          console.error('Failed to fetch my listings:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMyListings();
  }, [user]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
          {/* Page Header with Highlight */}
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-12 mb-16 border border-indigo-200 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-grow">
                <div className="inline-block mb-4">
                  <span className="text-sm font-semibold text-indigo-600 bg-indigo-100 px-4 py-2 rounded-full">Your Listings</span>
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-3">Grow Your Marketplace</h1>
                <p className="text-gray-600 text-lg max-w-2xl">Manage your items, track engagement, and reach more campus buyers</p>
              </div>
              {(user?.role === 'seller' || user?.role === 'admin') && (
                <Link
                  href={user?.role === 'admin' ? "/admin/add-product" : "/listings/create"}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all whitespace-nowrap flex-shrink-0 ml-8"
                >
                  <span className="text-2xl">+</span> Add Listing
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Stats - Enhanced Design */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="bg-white rounded-xl p-10 border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-blue-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-gray-600 text-xl font-semibold">Active Listings</h3>
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-3xl">📊</span>
                </div>
              </div>
              <p className="text-5xl font-bold text-gray-900">{myListings.filter(l => !l.is_sold).length}</p>
              <p className="text-base text-gray-500 mt-3">Currently active</p>
            </div>

            <div className="bg-white rounded-xl p-10 border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-green-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-gray-600 text-xl font-semibold">Sold Items</h3>
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-3xl">✓</span>
                </div>
              </div>
              <p className="text-5xl font-bold text-gray-900">{myListings.filter(l => l.is_sold).length}</p>
              <p className="text-base text-gray-500 mt-3">Completed sales</p>
            </div>

            <div className="bg-white rounded-xl p-10 border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-purple-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-gray-600 text-xl font-semibold">Messages</h3>
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-3xl">💬</span>
                </div>
              </div>
              <p className="text-5xl font-bold text-gray-900">2</p>
              <p className="text-base text-gray-500 mt-3">Unread messages</p>
            </div>

            <div className="bg-white rounded-xl p-10 border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-amber-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-gray-600 text-xl font-semibold">Views</h3>
                <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center">
                  <span className="text-3xl">👁</span>
                </div>
              </div>
              <p className="text-5xl font-bold text-gray-900">24</p>
              <p className="text-base text-gray-500 mt-3">This month</p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Listings Section - Takes 3 columns */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-10 py-8 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Your Listings</h2>
                    <p className="text-gray-600 text-base mt-2">Manage your products and track sales</p>
                  </div>
                  {(user?.role === 'admin' || user?.role === 'seller') && (
                    <Link
                      href={user?.role === 'admin' ? "/admin/add-product" : "/listings/create"}
                      className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg text-xl"
                    >
                      + New Listing
                    </Link>
                  )}
                </div>

                <div className="p-10">
                  {renderListingsContent()}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              {/* Quick Links */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 hover:shadow-md transition-all">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Access</h3>
                <div className="space-y-4">
                  <Link href="/marketplace" className="block px-6 py-4 text-xl font-bold text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all border border-gray-200">
                    Browse Marketplace
                  </Link>
                  {(user?.role === 'admin' || user?.role === 'seller') && (
                    <Link href={user?.role === 'admin' ? "/admin/add-product" : "/listings/create"} className="block px-6 py-4 text-xl font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all shadow-md hover:shadow-lg">
                      ✨ New Listing
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

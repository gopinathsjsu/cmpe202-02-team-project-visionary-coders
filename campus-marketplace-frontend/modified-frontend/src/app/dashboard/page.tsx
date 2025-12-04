'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { listingAPI } from '@/lib/api';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Listing {
  id: number;
  title: string;
  price: string;
  image: string;
  is_sold: boolean;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyListings = async () => {
      if (user?.id) {
        try {
          const data = await listingAPI.getListings({ seller_id: parseInt(user.id) });
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
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {user?.name}
              </h1>
              <span className="px-3 py-1 text-sm bg-indigo-100 text-indigo-800 rounded-full font-medium capitalize">
                {user?.role}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* My Listings Section */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">My Listings</h2>
                {(user?.role === 'admin' || user?.role === 'seller') && (
                  <Link
                    href={user?.role === 'admin' ? "/admin/add-product" : "/listings/create"}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    + Add New
                  </Link>
                )}
              </div>

              {loading ? (
                <p className="text-gray-500">Loading listings...</p>
              ) : myListings.length > 0 ? (
                <div className="space-y-4">
                  {myListings.map((listing) => (
                    <div key={listing.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-2xl">
                        {listing.image}
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium text-gray-900">{listing.title}</h3>
                        <p className="text-indigo-600 font-bold">{listing.price}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs rounded-full ${listing.is_sold ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {listing.is_sold ? 'Sold' : 'Active'}
                        </span>
                        <Link href={`/listings/${listing.id}`} className="block mt-2 text-sm text-gray-500 hover:text-gray-700">
                          View →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>You haven&apos;t listed anything yet.</p>
                  {(user?.role === 'admin' || user?.role === 'seller') && (
                    <Link
                      href={user?.role === 'admin' ? "/admin/add-product" : "/listings/create"}
                      className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Create your first listing
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Chats Section */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Chats</h2>
              <div className="space-y-4">
                {/* Placeholder for chats since backend API is missing list endpoint */}
                <div className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-xs">
                      JD
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">John Doe</h3>
                      <p className="text-xs text-gray-500">Regarding: Calculus Textbook</p>
                    </div>
                    <span className="ml-auto text-xs text-gray-400">2m ago</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-1">
                    Is this still available? I can meet on campus tomorrow.
                  </p>
                </div>

                <div className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xs">
                      AS
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Alice Smith</h3>
                      <p className="text-xs text-gray-500">Regarding: Graphing Calculator</p>
                    </div>
                    <span className="ml-auto text-xs text-gray-400">1h ago</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-1">
                    Thanks! See you at the library.
                  </p>
                </div>

                <div className="text-center py-4">
                  <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                    View All Messages
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

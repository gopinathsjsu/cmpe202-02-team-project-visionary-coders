'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { adminAPI } from '@/lib/api';
import Link from 'next/link';

interface Listing {
    id: number;
    title: string;
    price: number;
    category: string;
    photo_url: string;
    seller_id: number;
    created_at: string;
}

export default function AdminApprovalsPage() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPendingListings();
    }, []);

    const fetchPendingListings = async () => {
        try {
            const data = await adminAPI.getPendingListings();
            setListings(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch pending listings');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: number) => {
        try {
            await adminAPI.approveListing(id);
            setListings(listings.filter(l => l.id !== id));
        } catch (err: any) {
            alert(err.message || 'Failed to approve listing');
        }
    };

    const handleReject = async (id: number) => {
        if (!confirm('Are you sure you want to reject this listing?')) {
            return;
        }
        try {
            await adminAPI.rejectListing(id);
            setListings(listings.filter(l => l.id !== id));
        } catch (err: any) {
            alert(err.message || 'Failed to reject listing');
        }
    };

    return (
        <ProtectedRoute requireAdmin={true}>
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-3xl font-bold text-gray-900">Pending Approvals</h1>
                            <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full font-medium">
                                Pending: {listings.length}
                            </span>
                        </div>

                        {error && (
                            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">Loading pending listings...</p>
                            </div>
                        ) : listings.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">No pending listings to review.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {listings.map((listing) => (
                                    <div key={listing.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                        <div className="h-48 bg-gray-200 relative">
                                            {listing.photo_url ? (
                                                <img
                                                    src={listing.photo_url}
                                                    alt={listing.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-4xl">
                                                    📦
                                                </div>
                                            )}
                                            <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                                                ${listing.price}
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-lg font-medium text-gray-900 mb-1 truncate">{listing.title}</h3>
                                            <p className="text-sm text-gray-500 mb-4 capitalize">{listing.category}</p>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleApprove(listing.id)}
                                                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(listing.id)}
                                                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                            <Link
                                                href={`/listings/${listing.id}`}
                                                className="block text-center mt-3 text-sm text-indigo-600 hover:text-indigo-800"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

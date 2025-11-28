'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { listingAPI } from '@/lib/api';
import { Listing } from '@/types/auth';
import { useAuth } from '@/contexts/AuthContext';

function MarketplaceContent() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialQuery = searchParams.get('q') || '';
    const initialCategory = searchParams.get('category') || '';

    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const fetchListings = async (query?: string, category?: string) => {
        setIsLoading(true);
        try {
            let data;
            if (query) {
                // Use AI Search for text queries
                data = await listingAPI.aiSearch(query);
            } else {
                // Use standard filtering for category-only browsing
                const params: { q?: string; category?: string } = {};
                if (category) params.category = category;
                data = await listingAPI.getListings(params);
            }
            setListings(data);
        } catch (error) {
            console.error('Failed to fetch listings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchListings(initialQuery, initialCategory);
    }, [initialQuery, initialCategory]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchQuery) params.set('q', searchQuery);
        if (initialCategory) params.set('category', initialCategory);
        router.push(`/marketplace?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans flex flex-col">
            <div className="max-w-7xl mx-auto space-y-8 w-full flex-grow flex flex-col">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Product List</h1>
                        <p className="text-sm text-gray-500 mt-1">Track stock levels, availability, and restocking needs in real time.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {(user?.role === 'admin' || user?.role === 'seller') && (
                            <Link
                                href="/listings/create"
                                className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <span>+</span> Add Product
                            </Link>
                        )}
                        <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                            </svg>
                            Filter
                        </button>
                        <div className="flex bg-white border border-gray-200 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>



                {/* Product Grid */}
                {isLoading ? (
                    <div className="text-center py-20 text-gray-500">Loading products...</div>
                ) : listings.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {listings.map((item) => (
                            <Link
                                key={item.id}
                                href={`/listings/${item.id}`}
                                className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-gray-200 transition-all group flex flex-col h-full"
                            >
                                <div className="bg-gray-50 rounded-xl h-48 mb-4 flex items-center justify-center relative overflow-hidden">
                                    {item.photo_url ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={item.photo_url} alt={item.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-6xl">📦</span>
                                    )}
                                    {/* Hover Actions */}
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-50">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col flex-grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{item.title}</h3>
                                        <span className="font-bold text-gray-900">${item.price}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-4">{item.category}</p>

                                    <div className="mt-auto">
                                        <div className={`w-full py-2 px-4 rounded-lg text-center text-sm font-medium ${item.is_sold
                                            ? 'bg-red-50 text-red-600'
                                            : 'bg-green-50 text-green-600'
                                            }`}>
                                            {item.is_sold ? '• Sold Out' : '• In Stock'}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters to find what you&apos;re looking for.</p>
                    </div>
                )}

                {/* Pagination (Mock) */}
                <div className="flex justify-between items-center pt-8 border-t border-gray-200 mt-auto">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 font-medium">Show:</span>
                        <button className="bg-white border border-gray-200 rounded px-3 py-1 text-sm font-medium flex items-center gap-2">
                            8 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" /></svg>
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                        </button>
                        <button className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium">1</button>
                        <button className="px-4 py-2 hover:bg-gray-50 rounded-lg font-medium text-gray-600">2</button>
                        <button className="px-4 py-2 hover:bg-gray-50 rounded-lg font-medium text-gray-600">...</button>
                        <button className="px-4 py-2 hover:bg-gray-50 rounded-lg font-medium text-gray-600">12</button>
                        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function MarketplacePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <MarketplaceContent />
        </Suspense>
    );
}

'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { listingAPI } from '@/lib/api';
import { Listing } from '@/types/auth';
import { useAuth } from '@/contexts/AuthContext';

function MarketplaceContent() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const initialCategory = searchParams.get('category') || '';
    const initialPrice = searchParams.get('price') || '';

    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [priceRange, setPriceRange] = useState(initialPrice);
    const itemsPerPage = 8;

    const categories = [
      { name: 'Textbooks', icon: '📚' },
      { name: 'Electronics', icon: '💻' },
      { name: 'Furniture', icon: '🛋️' },
      { name: 'Clothing', icon: '👕' },
      { name: 'Supplies', icon: '✏️' },
      { name: 'Sports', icon: '⚽' },
    ];

    const priceOptions = [
      { value: '0-25', label: 'Under $25' },
      { value: '25-50', label: '$25 - $50' },
      { value: '50-100', label: '$50 - $100' },
      { value: '100-500', label: '$100 - $500' },
      { value: '500+', label: '$500+' },
    ];

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
            // Use fetched data or empty array
            setListings(data || []);
        } catch (error) {
            console.error('Failed to fetch listings:', error);
            // On error, show empty list
            setListings([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (initialQuery || initialCategory) {
            fetchListings(initialQuery, initialCategory);
        } else {
            // On initial load with no search/filter, fetch all listings from API
            fetchListings();
        }
        setCurrentPage(1);
    }, [initialQuery, initialCategory]);

    // Pagination calculations
    const totalPages = Math.ceil(listings.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentListings = listings.slice(startIndex, endIndex);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            window.scrollTo(0, 0);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            window.scrollTo(0, 0);
        }
    };

    const handlePageClick = (page: number) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans flex flex-col">
            <div className="max-w-7xl mx-auto space-y-8 w-full flex-grow flex flex-col">

                {/* Back Button */}
                <div className="mb-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                        Back to Home
                    </Link>
                </div>

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

                    <div className="flex items-center gap-3">
                        {(user?.role === 'admin' || user?.role === 'seller') && (
                            <Link
                                href="/listings/create"
                                className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 hover:shadow-lg hover:scale-105 transition-all"
                            >
                                <span className="text-xl">+</span> Add Product
                            </Link>
                        )}
                        <button 
                            onClick={() => setShowFilters(!showFilters)}
                            className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                            </svg>
                            Filter
                        </button>
                        <div className="flex bg-white border border-gray-200 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                                title="Grid View"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                                title="List View"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filter Dropdown */}
                {showFilters && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-4">
                        {/* Category Filter */}
                        <fieldset>
                            <legend className="text-sm font-semibold text-gray-900 mb-3">Category</legend>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                                <button
                                    onClick={() => setSelectedCategory('')}
                                    className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                                        selectedCategory === ''
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    All
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.name}
                                        onClick={() => setSelectedCategory(cat.name)}
                                        className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                                            selectedCategory === cat.name
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {cat.icon} {cat.name}
                                    </button>
                                ))}
                            </div>
                        </fieldset>

                        {/* Price Filter */}
                        <fieldset>
                            <legend className="text-sm font-semibold text-gray-900 mb-3">Price Range</legend>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                                <button
                                    onClick={() => setPriceRange('')}
                                    className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                                        priceRange === ''
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Any
                                </button>
                                {priceOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setPriceRange(option.value)}
                                        className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                                            priceRange === option.value
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </fieldset>

                        {/* Apply Filters Button */}
                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={() => {
                                    const params = new URLSearchParams();
                                    if (initialQuery) params.append('q', initialQuery);
                                    if (selectedCategory) params.append('category', selectedCategory);
                                    if (priceRange) params.append('price', priceRange);
                                    globalThis.location.href = `/marketplace?${params.toString()}`;
                                }}
                                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-all"
                            >
                                Apply Filters
                            </button>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {/* Product Grid/List */}
                {isLoading ? (
                    <div className="text-center py-20 text-gray-500">Loading products...</div>
                ) : null}
                {!isLoading && listings.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters to find what you&apos;re looking for.</p>
                    </div>
                ) : null}
                {!isLoading && listings.length > 0 ? (
                    viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {currentListings.map((item) => (
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
                                            <h3 className="font-bold text-gray-900 text-xl line-clamp-1">{item.title}</h3>
                                            <span className="font-bold text-gray-900">${item.price}</span>
                                        </div>
                                        <p className="text-base text-gray-500 mb-2">{item.category}</p>
                                        {item.location && (
                                            <div className="flex items-center gap-1 text-sm text-indigo-600 font-medium mb-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                                </svg>
                                                <span className="truncate">{item.location}</span>
                                            </div>
                                        )}

                                        <div className="mt-auto">
                                            <div className={`w-full py-2 px-4 rounded-lg text-center text-base font-medium ${item.is_sold
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
                        <div className="space-y-4">
                            {currentListings.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/listings/${item.id}`}
                                    className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-gray-200 transition-all group flex gap-6 items-center"
                                >
                                    <div className="w-32 h-32 flex-shrink-0 bg-gray-50 rounded-xl flex items-center justify-center relative overflow-hidden">
                                        {item.photo_url ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={item.photo_url} alt={item.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-4xl">📦</span>
                                        )}
                                    </div>

                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">{item.title}</h3>
                                            <span className="font-bold text-gray-900 text-lg">${item.price}</span>
                                        </div>
                                        <p className="text-base text-gray-500 mb-2">{item.category}</p>
                                        {item.location && (
                                            <div className="flex items-center gap-1 text-sm text-indigo-600 font-medium mb-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                                </svg>
                                                <span>{item.location}</span>
                                            </div>
                                        )}
                                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.description}</p>
                                        <div className={`inline-block py-1 px-3 rounded-lg text-sm font-medium ${item.is_sold
                                            ? 'bg-red-50 text-red-600'
                                            : 'bg-green-50 text-green-600'
                                            }`}>
                                            {item.is_sold ? '• Sold Out' : '• In Stock'}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )
                ) : null}

                {/* Pagination */}
                {!isLoading && listings.length > 0 ? (
                    <div className="flex justify-between items-center pt-8 border-t border-gray-200 mt-auto">
                        <div className="flex items-center gap-2">
                            <span className="text-base text-gray-600 font-medium">Page {currentPage} of {totalPages}</span>
                        </div>

                        <div className="flex gap-2">
                            <button 
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                </svg>
                            </button>
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageClick(page)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        page === currentPage
                                            ? 'bg-gray-900 text-white'
                                            : 'hover:bg-gray-50 text-gray-600'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            
                            <button 
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ) : null}
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

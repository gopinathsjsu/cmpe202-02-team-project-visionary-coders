'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { listingAPI, chatAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Listing } from '@/types/auth';
import { mockProducts } from '@/lib/mockData';

// Temporary type definition removed, using imported Listing type

export default function ListingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const { id } = params;
    const [listing, setListing] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cart, setCart] = useState<number[]>([]);


    const handleAddToCart = () => {
        if (!isAuthenticated) {
            router.push('/auth/signin');
            return;
        }
        if (listing) {
            setCart([...cart, listing.id]);
        }
    };

    const handleOpenChat = async () => {
        if (!isAuthenticated) {
            router.push('/auth/signin');
            return;
        }
        if (!listing) return;

        try {
            // Create or fetch existing chat room
            if (!user) {
                setError('You must be logged in to chat');
                return;
            }
            const room = await chatAPI.getOrCreateRoom(listing.id, listing.seller_id, parseInt(user.id.toString()));

            // Navigate to chat room
            router.push(`/chat/${room.id}`);
        } catch (err) {
            console.error('Error creating chat room:', err);
            setError('Failed to open chat. Please try again.');
        }
    };

    useEffect(() => {
        const fetchListing = async () => {
            if (!id) return;
            try {
                const data = await listingAPI.getListingById(id as string);
                setListing(data);
            } catch (err) {
                console.error('API failed, trying mock products:', err);
                // Fallback to mock products
                const mockProduct = mockProducts.find(p => String(p.id) === String(id));
                if (mockProduct) {
                    setListing(mockProduct as unknown as Listing);
                } else {
                    setError('Failed to load listing details');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchListing();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !listing) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <p className="text-red-500 mb-4">{error || 'Listing not found'}</p>
                <button
                    onClick={() => router.back()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Card */}
                <div className="bg-white rounded-3xl p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6 text-gray-600"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Product Details</h1>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                        </button>
                        <button
                            onClick={handleOpenChat}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-base font-medium flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Chat with Seller
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    {/* Left Column - Images */}
                    <div className="lg:col-span-5 flex flex-col">
                        <div className="bg-white rounded-3xl p-8 h-full flex flex-col shadow-lg hover:shadow-2xl transition-shadow duration-300 hover:-translate-y-1">
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Product Image</h2>
                            <p className="text-base text-gray-400 mb-6">Set your thumbnail product.</p>

                            <div className="relative aspect-square w-full bg-[#F8F9FA] rounded-2xl overflow-hidden flex items-center justify-center mb-6 flex-grow">
                                {listing.photo_url ? (
                                    <img
                                        src={listing.photo_url.startsWith('http') ? listing.photo_url : `http://localhost:8000${listing.photo_url}`}
                                        alt={listing.title}
                                        className="object-contain w-full h-full p-8 mix-blend-multiply"
                                    />
                                ) : (
                                    <div className="text-gray-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails */}
                            <div className="grid grid-cols-3 gap-4 mt-auto">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-[#F8F9FA] rounded-xl p-4 border border-transparent hover:border-indigo-200 transition-all cursor-pointer aspect-square flex items-center justify-center group">
                                        {listing.photo_url ? (
                                            <img
                                                src={listing.photo_url.startsWith('http') ? listing.photo_url : `http://localhost:8000${listing.photo_url}`}
                                                alt={`Thumbnail ${i}`}
                                                className="object-contain w-full h-full mix-blend-multiply opacity-70 group-hover:opacity-100 transition-opacity"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Seller Info */}
                            {listing.seller && (
                                <div className="mt-6 w-full bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200 text-indigo-900 font-semibold py-3 px-4 rounded-xl">
                                    <div className="flex items-center justify-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                        </svg>
                                        Seller: {listing.seller.name}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="lg:col-span-7 flex flex-col">
                        <div className="bg-white rounded-3xl p-8 h-full flex flex-col shadow-lg hover:shadow-2xl transition-shadow duration-300 hover:-translate-y-1">
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Product Detail</h2>
                            <p className="text-base text-gray-400 mb-8">Detailed information about the product.</p>

                            <div className="space-y-8 flex-grow">
                                {/* Product Name */}
                                <div>
                                    <div className="block text-xl font-bold text-gray-900 mb-3">Product Name</div>
                                    <div className="w-full p-4 bg-white border border-gray-100 rounded-xl text-xl text-gray-700 font-medium">
                                        {listing.title}
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <div className="block text-xl font-bold text-gray-900 mb-3">Description</div>
                                    <div className="w-full p-4 bg-white border border-gray-100 rounded-xl text-base text-gray-600 min-h-[120px] leading-relaxed">
                                        {listing.description}
                                    </div>
                                </div>

                                {/* Category */}
                                <div>
                                    <div className="block text-xl font-bold text-gray-900 mb-3">Category</div>
                                    <div className="w-full p-4 bg-white border border-gray-100 rounded-xl text-base text-gray-700 flex justify-between items-center font-medium">
                                        <span>{listing.category.charAt(0).toUpperCase() + listing.category.slice(1).toLowerCase()}</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Location */}
                                {listing.location && (
                                    <div>
                                        <div className="block text-xl font-bold text-gray-900 mb-3">Pickup Location</div>
                                        <div className="w-full p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-200 rounded-xl text-base text-gray-700 flex justify-between items-center font-medium hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-indigo-600">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                                </svg>
                                                <span>{listing.location}</span>
                                            </div>
                                            <a
                                                href={`https://www.google.com/maps/search/${encodeURIComponent(listing.location + ', San Jose State University')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="ml-3 px-3 py-1 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                                                </svg>
                                                View on Map
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Price & Status */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <div className="block text-xl font-bold text-gray-900 mb-3">Price</div>
                                        <div className="w-full p-4 bg-white border border-gray-100 rounded-xl text-xl text-gray-900 font-semibold flex items-center">
                                            <span className="text-gray-400 mr-2">Base Price</span>
                                            ${listing.price}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="block text-xl font-bold text-gray-900 mb-3">Status</div>
                                        <div className="w-full p-4 bg-white border border-gray-100 rounded-xl text-base text-gray-700 flex justify-between items-center font-medium">
                                            <span>{listing.is_sold ? 'Sold Out' : 'Available'}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-6 mt-auto">
                                    <div className="flex gap-4">
                                        <button
                                            onClick={handleAddToCart}
                                            className="flex-1 bg-white border-2 border-indigo-600 text-indigo-600 font-bold text-base py-4 rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.622 0 1.151.432 1.271 1.033a12 12 0 0 0 11.618 9.967h7.48c.55 0 1.042.294 1.3.763a1 1 0 0 0 1.4-1.268" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 21h10a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-4l-2-2H7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2z" />
                                            </svg>
                                            Add to Cart
                                        </button>
                                        <button
                                            onClick={handleOpenChat}
                                            disabled={listing.is_sold}
                                            className={`flex-1 font-bold text-base py-4 rounded-xl transition-colors flex items-center justify-center gap-2 ${listing.is_sold
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                }`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {listing.is_sold ? 'Sold Out' : 'Make an Offer'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

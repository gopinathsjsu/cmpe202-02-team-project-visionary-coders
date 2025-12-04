'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { listingAPI } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { Listing } from '@/types/auth'; // Assuming Listing type is exported from auth or a shared types file
import Image from 'next/image';

// Temporary type definition removed, using imported Listing type

export default function ListingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;
    const { addToCart, removeFromCart, items } = useCart();
    const [listing, setListing] = useState<Listing | null>(null);

    const cartItem = listing ? items.find(item => item.listing.id === listing.id) : undefined;
    const isInCart = !!cartItem;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchListing = async () => {
            if (!id) return;
            try {
                const data = await listingAPI.getListingById(id as string);
                setListing(data);
            } catch (err) {
                setError('Failed to load listing details');
                console.error(err);
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
                        <button className="px-4 py-2 bg-indigo-900 text-white rounded-lg hover:bg-indigo-800 transition-colors text-sm font-medium">
                            Contact Seller
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    {/* Left Column - Images */}
                    <div className="lg:col-span-5 flex flex-col">
                        <div className="bg-white rounded-3xl p-8 h-full flex flex-col">
                            <h2 className="text-lg font-bold text-gray-900 mb-2">Product Image</h2>
                            <p className="text-sm text-gray-400 mb-6">Set your thumbnail product.</p>

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
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="lg:col-span-7 flex flex-col">
                        <div className="bg-white rounded-3xl p-8 h-full flex flex-col">
                            <h2 className="text-lg font-bold text-gray-900 mb-2">Product Detail</h2>
                            <p className="text-sm text-gray-400 mb-8">Detailed information about the product.</p>

                            <div className="space-y-8 flex-grow">
                                {/* Product Name */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">Product Name</label>
                                    <div className="w-full p-4 bg-white border border-gray-100 rounded-xl text-gray-700">
                                        {listing.title}
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">Description</label>
                                    <div className="w-full p-4 bg-white border border-gray-100 rounded-xl text-gray-600 min-h-[120px]">
                                        {listing.description}
                                    </div>
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">Category</label>
                                    <div className="w-full p-4 bg-white border border-gray-100 rounded-xl text-gray-700 flex justify-between items-center">
                                        <span>{listing.category}</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Price & Status */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">Price</label>
                                        <div className="w-full p-4 bg-white border border-gray-100 rounded-xl text-gray-900 font-semibold flex items-center">
                                            <span className="text-gray-400 mr-2">Base Price</span>
                                            ${listing.price}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">Status</label>
                                        <div className="w-full p-4 bg-white border border-gray-100 rounded-xl text-gray-700 flex justify-between items-center">
                                            <span>{listing.is_sold ? 'Sold Out' : 'Available'}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-4 mt-auto">
                                    <div className="flex gap-4">
                                        <button className="flex-[3] bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-colors">
                                            Make an Offer
                                        </button>
                                        <button
                                            onClick={async () => {
                                                try {
                                                    if (isInCart && cartItem) {
                                                        await removeFromCart(cartItem.id);
                                                        // alert('Removed from cart'); // Optional: feedback
                                                    } else {
                                                        await addToCart(listing.id);
                                                        // alert('Added to cart!'); // Optional: feedback
                                                    }
                                                } catch (err) {
                                                    console.error(err);
                                                    alert('Failed to update cart');
                                                }
                                            }}
                                            className="flex-[1] bg-white border-2 border-gray-100 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center"
                                        >
                                            {isInCart ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-500">
                                                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-red-500">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                                </svg>
                                            )}
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

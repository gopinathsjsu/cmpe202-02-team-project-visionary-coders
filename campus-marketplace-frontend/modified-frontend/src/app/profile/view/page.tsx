'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function ViewProfilePage() {
    const { user } = useAuth();
    const router = useRouter();

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header with Back Button */}
                    <div className="flex items-center justify-between mb-8">
                        <button
                            onClick={() => router.back()}
                            className="text-indigo-600 hover:text-indigo-700 font-semibold text-xl flex items-center gap-2 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                            Back
                        </button>
                    </div>

                    {/* Profile Card - Clean Design */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-12 sm:px-10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-4xl font-bold text-white">
                                        {user?.name}
                                    </h3>
                                    <p className="text-indigo-100 mt-2 text-xl">{user?.email}</p>
                                </div>
                                <div className="w-24 h-24 bg-indigo-400 rounded-full flex items-center justify-center text-white font-bold text-5xl shadow-lg">
                                    {user?.name.charAt(0).toUpperCase()}
                                </div>
                            </div>
                        </div>

                        {/* Content - View Only */}
                        <div className="px-8 py-10 sm:px-10">
                            <div className="space-y-8">
                                <div className="pb-6 border-b border-gray-200">
                                    <p className="block text-base font-semibold text-gray-600 mb-3">
                                        Full Name
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900">{user?.name}</p>
                                </div>

                                <div className="pb-6 border-b border-gray-200">
                                    <p className="block text-base font-semibold text-gray-600 mb-3">
                                        Email Address
                                    </p>
                                    <p className="text-xl text-gray-900">{user?.email}</p>
                                </div>

                                <div className="pb-6 border-b border-gray-200">
                                    <p className="block text-base font-semibold text-gray-600 mb-3">
                                        Member Since
                                    </p>
                                    <p className="text-xl text-gray-900">
                                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        }) : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

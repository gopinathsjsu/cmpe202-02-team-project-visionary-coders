'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';

export default function EditProfilePage() {
    const { user } = useAuth();
    const router = useRouter();
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form state for profile editing
    const [formData, setFormData] = useState({
        name: '',
        email: '',
    });

    // Form state for password change
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Initialize form with user data
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
            }));
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target as HTMLInputElement;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        setError('');
    };

    const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value,
        }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Validate inputs
            if (!formData.name.trim()) {
                setError('Name is required');
                setLoading(false);
                return;
            }

            const updateData: any = {
                name: formData.name,
            };

            // Call API
            await authAPI.updateProfile(updateData);

            setSuccess('Profile updated successfully!');

            // Redirect to view profile after a short delay
            setTimeout(() => {
                router.push('/profile/view');
            }, 1500);
        } catch (err: any) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Validate passwords
            if (!passwordData.currentPassword) {
                setError('Current password is required');
                setLoading(false);
                return;
            }

            if (!passwordData.newPassword) {
                setError('New password is required');
                setLoading(false);
                return;
            }

            if (passwordData.newPassword !== passwordData.confirmPassword) {
                setError('New passwords do not match');
                setLoading(false);
                return;
            }

            if (passwordData.newPassword.length < 6) {
                setError('New password must be at least 6 characters long');
                setLoading(false);
                return;
            }

            // Call API with password change
            await authAPI.updateProfile({
                password: passwordData.newPassword,
                currentPassword: passwordData.currentPassword,
            } as any);

            setSuccess('Password changed successfully!');
            setIsChangingPassword(false);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });

            // Redirect to view profile after a short delay
            setTimeout(() => {
                router.push('/profile/view');
            }, 1500);
        } catch (err: any) {
            setError(err.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header with Back Button and Change Password Button */}
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
                        {!isChangingPassword && (
                            <button
                                onClick={() => setIsChangingPassword(true)}
                                className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xl py-2 px-5 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                                Change Password
                            </button>
                        )}
                    </div>

                    {/* Alert Messages */}
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                            <p className="text-red-700 flex items-center gap-2 font-medium text-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                </svg>
                                {error}
                            </p>
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
                            <p className="text-green-700 flex items-center gap-2 font-medium text-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {success}
                            </p>
                        </div>
                    )}

                    {/* Password Change Modal */}
                    {isChangingPassword && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Change Password</h2>

                                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="currentPassword" className="block text-base font-semibold text-gray-700 mb-3">
                                            Current Password *
                                        </label>
                                        <input
                                            id="currentPassword"
                                            type="password"
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordInputChange}
                                            placeholder="Enter current password"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-xl text-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="newPassword" className="block text-base font-semibold text-gray-700 mb-3">
                                            New Password *
                                        </label>
                                        <input
                                            id="newPassword"
                                            type="password"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordInputChange}
                                            placeholder="Enter new password"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-xl text-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900"
                                            required
                                        />
                                        <p className="text-sm text-gray-500 mt-2">Minimum 6 characters</p>
                                    </div>

                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-base font-semibold text-gray-700 mb-3">
                                            Confirm New Password *
                                        </label>
                                        <input
                                            id="confirmPassword"
                                            type="password"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordInputChange}
                                            placeholder="Confirm new password"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-xl text-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900"
                                            required
                                        />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-6">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsChangingPassword(false);
                                                setError('');
                                                setPasswordData({
                                                    currentPassword: '',
                                                    newPassword: '',
                                                    confirmPassword: '',
                                                });
                                            }}
                                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-bold text-xl rounded-lg hover:bg-gray-50 transition-colors"
                                            disabled={loading}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-3 bg-amber-500 text-white font-bold text-xl rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Updating...
                                                </>
                                            ) : (
                                                'Update Password'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

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

                        {/* Content - Edit Mode */}
                        <div className="px-8 py-10 sm:px-10">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-base font-semibold text-gray-900 mb-3">
                                        Full Name *
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter your full name"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-xl text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-base font-semibold text-gray-900 mb-3">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        readOnly
                                        placeholder="Enter your email"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-xl text-lg bg-gray-100 text-gray-600 cursor-not-allowed opacity-75"
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            router.push('/profile/view');
                                        }}
                                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-bold text-xl rounded-lg hover:bg-gray-50 transition-colors"
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 bg-indigo-600 text-white font-bold text-xl rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

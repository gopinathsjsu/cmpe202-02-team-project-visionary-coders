'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { signInSchema, SignInFormData } from '@/lib/validation';

export default function SignInForm() {
  const { signIn } = useAuth();
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      setError('');
      setIsSubmitting(true);
      await signIn(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white" suppressHydrationWarning>
      <div className="w-full max-w-xl px-6 py-12">
        <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-200">
          {/* Back to Home Link */}
          <Link
            href="/"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-10 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to Home
          </Link>

          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold text-gray-900 mb-3">
              Sign In
            </h1>
            <p className="text-xl text-gray-600">
              Enter your credentials to continue
            </p>
          </div>

          {/* Form Section */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                <p className="text-base text-red-800 font-medium">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-base font-semibold text-gray-900 mb-2">
                Email
              </label>
              <input
                {...register('email')}
                id="email"
                type="email"
                autoComplete="email"
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all"
                placeholder="student@sjsu.edu"
              />
              {errors.email && (
                <p className="mt-2 text-base text-red-600 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-base font-semibold text-gray-900 mb-2">
                Password
              </label>
              <input
                {...register('password')}
                id="password"
                type="password"
                autoComplete="current-password"
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-2 text-base text-red-600 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 border border-gray-300 rounded accent-blue-600" suppressHydrationWarning />
                <span className="text-base text-gray-700 font-medium">Remember me</span>
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-base font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 text-xl font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Sign Up Link */}
            <div className="text-center pt-2">
              <p className="text-base text-gray-700">
                Don&apos;t have an account?{' '}
                <Link
                  href="/auth/signup"
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Create one
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

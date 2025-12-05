'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { signUpSchema, SignUpFormData } from '@/lib/validation';

export default function SignUpForm() {
  const { signUp } = useAuth();
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      role: 'buyer', // Default role is buyer
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setError('');
      setIsSubmitting(true);

      // Role is now handled by the form
      await signUp(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage || 'Failed to create account. Please try again.');
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
              Sign Up
            </h1>
            <p className="text-xl text-gray-600">
              Use your college email address to sign up
            </p>
          </div>

          {/* Form Section */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                <p className="text-base text-red-800 font-medium">{error}</p>
              </div>
            )}

            {/* Full Name Field */}
            <div>
              <label htmlFor="name" className="block text-base font-semibold text-gray-900 mb-2">
                Full Name
              </label>
              <input
                {...register('name')}
                id="name"
                type="text"
                autoComplete="name"
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all"
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-2 text-base text-red-600 font-medium">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-base font-semibold text-gray-900 mb-2">
                College Email
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
              <div className="flex items-center gap-2 mb-2">
                <label htmlFor="password" className="block text-base font-semibold text-gray-900">
                  Password
                </label>
                <div className="group relative inline-block">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 text-gray-400 cursor-help hover:text-gray-600 transition-colors">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                    <text x="12" y="16" textAnchor="middle" fill="currentColor" fontSize="12" fontWeight="bold">i</text>
                  </svg>
                  {/* Tooltip */}
                  <div className="absolute left-full ml-2 bottom-1/2 translate-y-1/2 hidden group-hover:block bg-gray-900 text-white text-base rounded-lg px-3 py-2 whitespace-nowrap z-10 pointer-events-none">
                    At least 8 characters: uppercase, lowercase, number, special character
                  </div>
                </div>
              </div>
              <input
                {...register('password')}
                id="password"
                type="password"
                autoComplete="new-password"
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-2 text-base text-red-600 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-base font-semibold text-gray-900 mb-2">
                Confirm Password
              </label>
              <input
                {...register('confirmPassword')}
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-base text-red-600 font-medium">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-3">
                I want to...
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none">
                  <input
                    type="radio"
                    {...register('role')}
                    value="buyer"
                    className="sr-only peer"
                  />
                  <span className="flex flex-1">
                    <span className="flex flex-col">
                      <span className="block text-sm font-medium text-gray-900 peer-checked:text-blue-600">Buy Items</span>
                      <span className="mt-1 flex items-center text-sm text-gray-500">Find great deals on campus</span>
                    </span>
                  </span>
                  <span className="pointer-events-none absolute -inset-px rounded-lg border-2 border-transparent peer-checked:border-blue-600" aria-hidden="true"></span>
                  <span className="pointer-events-none absolute right-4 top-4 h-4 w-4 rounded-full border border-gray-300 bg-white peer-checked:border-blue-600 peer-checked:bg-blue-600"></span>
                </label>

                <label className="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none">
                  <input
                    type="radio"
                    {...register('role')}
                    value="seller"
                    className="sr-only peer"
                  />
                  <span className="flex flex-1">
                    <span className="flex flex-col">
                      <span className="block text-sm font-medium text-gray-900 peer-checked:text-blue-600">Sell Items</span>
                      <span className="mt-1 flex items-center text-sm text-gray-500">List your items for sale</span>
                    </span>
                  </span>
                  <span className="pointer-events-none absolute -inset-px rounded-lg border-2 border-transparent peer-checked:border-blue-600" aria-hidden="true"></span>
                  <span className="pointer-events-none absolute right-4 top-4 h-4 w-4 rounded-full border border-gray-300 bg-white peer-checked:border-blue-600 peer-checked:bg-blue-600"></span>
                </label>
              </div>
              {errors.role && (
                <p className="mt-2 text-base text-red-600 font-medium">{errors.role.message}</p>
              )}
            </div>


            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 text-xl font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? 'Creating account...' : 'Sign up'}
            </button>

            {/* Sign In Link */}
            <div className="text-center pt-2">
              <p className="text-base text-gray-700">
                Already have an account?{' '}
                <Link
                  href="/auth/signin"
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

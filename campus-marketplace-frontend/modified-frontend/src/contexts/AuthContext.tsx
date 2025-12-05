'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { User, AuthContextType, SignInData, SignUpData } from '@/types/auth';
import { authAPI } from '@/lib/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = Cookies.get('auth_token');
      if (token) {
        try {
          const userData = await authAPI.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Failed to get user:', error);
          Cookies.remove('auth_token');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const signIn = async (data: SignInData) => {
    try {
      const response = await authAPI.signIn(data);
      if (response.user) {
        setUser(response.user);
        setIsLoading(false);
        // Small delay to ensure state is updated before redirect
        setTimeout(() => {
          if (response.user?.role === 'admin') {
            router.push('/admin/dashboard');
          } else {
            router.push('/');
          }
        }, 50);
      }
    } catch (error: unknown) {
      setIsLoading(false);
      throw error;
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      setIsLoading(true);
      await authAPI.signUp(data);
      // After successful signup, redirect to sign in page
      router.push('/auth/signin');
    } catch (error: unknown) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    authAPI.signOut();
    setUser(null);
    router.push('/auth/signin');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

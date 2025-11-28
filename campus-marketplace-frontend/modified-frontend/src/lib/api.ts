import axios from 'axios';
import Cookies from 'js-cookie';
import { SignUpData, SignInData, AuthResponse, User } from '@/types/auth';

// Configure axios instance
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication API functions
export const authAPI = {
  // Sign up user
  signUp: async (data: SignUpData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/signup', data);
      if (response.data.token) {
        Cookies.set('auth_token', response.data.token, { expires: 7 });
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Sign up failed');
    }
  },

  // Sign in user
  signIn: async (data: SignInData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/signin', data);
      if (response.data.token) {
        Cookies.set('auth_token', response.data.token, { expires: 7 });
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Sign in failed');
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await apiClient.get<{ user: User }>('/auth/me');
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get user');
    }
  },

  // Sign out
  signOut: () => {
    Cookies.remove('auth_token');
  },

  // Verify token
  verifyToken: async (token: string): Promise<boolean> => {
    try {
      const response = await apiClient.post('/auth/verify', { token });
      return response.data.valid;
    } catch {
      return false;
    }
  },
};

export default apiClient;

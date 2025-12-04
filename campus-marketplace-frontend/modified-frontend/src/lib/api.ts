import axios from 'axios';
import Cookies from 'js-cookie';
import { SignUpData, SignInData, AuthResponse, User } from '@/types/auth';

// Configure axios instance
// Configure axios instance
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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
      // 1. Register
      await apiClient.post('/auth/register', {
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
      });

      // 2. Auto-login to get token
      const loginResponse = await apiClient.post<{ access_token: string }>('/auth/login', {
        username: data.email, // OAuth2 expects username form field usually, but let's check backend schema
        email: data.email, // Our backend might expect email in JSON body
        password: data.password,
      });

      const token = loginResponse.data.access_token;
      if (token) {
        Cookies.set('auth_token', token, { expires: 7 });
      }

      // 3. Get user details
      const userResponse = await apiClient.get<User>('/users/me');

      return {
        success: true,
        message: 'Sign up successful',
        token,
        user: userResponse.data,
      };
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      throw new Error(err.response?.data?.detail || 'Sign up failed');
    }
  },

  // Sign in user
  signIn: async (data: SignInData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<{ access_token: string }>('/auth/login', {
        email: data.email,
        password: data.password,
      });

      const token = response.data.access_token;
      if (token) {
        Cookies.set('auth_token', token, { expires: 7 });
      }

      // Get user details
      const userResponse = await apiClient.get<User>('/users/me');

      return {
        success: true,
        message: 'Sign in successful',
        token,
        user: userResponse.data,
      };
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      throw new Error(err.response?.data?.detail || 'Sign in failed');
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await apiClient.get<User>('/users/me');
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      throw new Error(err.response?.data?.detail || 'An error occurred');
    }
  },

  // Sign out
  signOut: () => {
    Cookies.remove('auth_token');
  },

  // Verify token
  verifyToken: async (): Promise<boolean> => {
    try {
      // Backend doesn't have a specific verify endpoint, but we can try /users/me
      await apiClient.get('/users/me');
      return true;
    } catch {
      return false;
    }
  },
};

// Listing API functions
export const listingAPI = {
  getListings: async (params?: { q?: string; category?: string; min_price?: number; max_price?: number; seller_id?: number }) => {
    try {
      const response = await apiClient.get('/listings', { params });
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      throw new Error(err.response?.data?.detail || 'Failed to fetch listings');
    }
  },
  getListingById: async (id: string) => {
    try {
      const response = await apiClient.get(`/listings/${id}`);
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      throw new Error(err.response?.data?.detail || 'Failed to fetch listing details');
    }
  },
  aiSearch: async (question: string) => {
    try {
      const response = await apiClient.post('/search/nl', { question });
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      throw new Error(err.response?.data?.detail || 'AI Search failed');
    }
  },
  createListing: async (data: any) => {
    try {
      const response = await apiClient.post('/listings', data);
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      throw new Error(err.response?.data?.detail || 'Failed to create listing');
    }
  },
  uploadPhoto: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post('/listings/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      throw new Error(err.response?.data?.detail || 'Failed to upload photo');
    }
  },
};

export const cartAPI = {
  getCart: async () => {
    try {
      const response = await apiClient.get('/cart');
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      throw new Error(err.response?.data?.detail || 'Failed to fetch cart');
    }
  },
  addToCart: async (listingId: number) => {
    try {
      const response = await apiClient.post(`/cart/add/${listingId}`);
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      throw new Error(err.response?.data?.detail || 'Failed to add to cart');
    }
  },
  removeFromCart: async (itemId: number) => {
    try {
      const response = await apiClient.delete(`/cart/items/${itemId}`);
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      throw new Error(err.response?.data?.detail || 'Failed to remove from cart');
    }
  },
};

export default apiClient;

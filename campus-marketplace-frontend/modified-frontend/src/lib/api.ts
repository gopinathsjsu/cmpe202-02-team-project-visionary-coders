import axios from 'axios';
import Cookies from 'js-cookie';
import { SignUpData, SignInData, AuthResponse, User } from '@/types/auth';

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
      // 1. Register - creates user in SQLite database
      await apiClient.post('/auth/register', {
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
      });

      // User created successfully in database, return success
      return {
        success: true,
        message: 'Sign up successful. Please sign in with your credentials.',
        token: undefined,
        user: undefined,
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

      // Fetch user details from backend
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
      const token = Cookies.get('auth_token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await apiClient.get<User>('/users/me');
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      throw new Error(err.message || 'An error occurred');
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

  // Update user profile
  updateProfile: async (data: { name?: string; email?: string; password?: string }): Promise<User> => {
    try {
      const response = await apiClient.put<User>('/users/me', data);
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      throw new Error(err.response?.data?.detail || 'Failed to update profile');
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
  deleteListing: async (id: string | number) => {
    try {
      const response = await apiClient.delete(`/listings/${id}`);
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      throw new Error(err.response?.data?.detail || 'Failed to delete listing');
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
  markSold: async (id: number) => {
    try {
      const response = await apiClient.patch(`/listings/${id}/sold`);
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      throw new Error(err.response?.data?.detail || 'Failed to mark listing as sold');
    }
  },
  reportListing: async (listingId: number, reason: string) => {
    try {
      const response = await apiClient.post('/reports', { listing_id: listingId, reason });
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      throw new Error(err.response?.data?.detail || 'Failed to report listing');
    }
  },
};

// Chat API functions
export const chatAPI = {
  // Get all chat rooms for current user
  getRooms: async () => {
    try {
      const response = await apiClient.get('/chat/rooms');
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      throw new Error(err.response?.data?.detail || 'Failed to fetch chat rooms');
    }
  },

  // Get specific room
  getRoom: async (roomId: number) => {
    try {
      const response = await apiClient.get(`/chat/rooms/${roomId}`);
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      throw new Error(err.response?.data?.detail || 'Failed to fetch chat room');
    }
  },

  // Get messages for room
  getMessages: async (roomId: number, limit: number = 50, offset: number = 0) => {
    try {
      const response = await apiClient.get(`/chat/rooms/${roomId}/messages`, {
        params: { limit, offset },
      });
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      throw new Error(err.response?.data?.detail || 'Failed to fetch messages');
    }
  },

  // Create or get existing room
  getOrCreateRoom: async (listingId: number, sellerId: number, buyerId: number) => {
    try {
      const response = await apiClient.post('/chat/rooms', {
        listing_id: listingId,
        seller_id: sellerId,
        buyer_id: buyerId,
      });
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      throw new Error(err.response?.data?.detail || 'Failed to create chat room');
    }
  },

  // Send message
  sendMessage: async (roomId: number, content: string, senderId: number) => {
    try {
      const response = await apiClient.post(`/chat/rooms/${roomId}/messages`, {
        content,
        sender_id: senderId,
      });
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      throw new Error(err.response?.data?.detail || 'Failed to send message');
    }
  },

  // Delete room
  deleteRoom: async (roomId: number) => {
    try {
      const response = await apiClient.delete(`/chat/rooms/${roomId}`);
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      throw new Error(err.response?.data?.detail || 'Failed to delete chat room');
    }
  },
};

// Admin API functions
export const adminAPI = {
  getSummary: async () => {
    try {
      const response = await apiClient.get('/admin/summary');
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      throw new Error(err.response?.data?.detail || 'Failed to fetch admin summary');
    }
  },

  getUsers: async () => {
    try {
      const response = await apiClient.get('/admin/users');
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      throw new Error(err.response?.data?.detail || 'Failed to fetch users');
    }
  },

  deleteUser: async (id: number) => {
    try {
      const response = await apiClient.delete(`/admin/users/${id}`);
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      throw new Error(err.response?.data?.detail || 'Failed to delete user');
    }
  },

  getPendingListings: async () => {
    try {
      const response = await apiClient.get('/admin/listings/pending');
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      throw new Error(err.response?.data?.detail || 'Failed to fetch pending listings');
    }
  },

  approveListing: async (id: number) => {
    try {
      const response = await apiClient.patch(`/admin/listings/${id}/approve`);
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      throw new Error(err.response?.data?.detail || 'Failed to approve listing');
    }
  },

  rejectListing: async (id: number) => {
    try {
      const response = await apiClient.patch(`/admin/listings/${id}/reject`);
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      throw new Error(err.response?.data?.detail || 'Failed to reject listing');
    }
  },

  getListings: async (params?: any) => {
    try {
      const response = await apiClient.get('/admin/listings', { params });
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      throw new Error(err.response?.data?.detail || 'Failed to fetch listings');
    }
  },

  updateListing: async (id: number, data: any) => {
    try {
      const response = await apiClient.patch(`/admin/listings/${id}`, data);
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      throw new Error(err.response?.data?.detail || 'Failed to update listing');
    }
  },

  deleteListing: async (id: number) => {
    try {
      const response = await apiClient.delete(`/admin/listings/${id}`);
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      throw new Error(err.response?.data?.detail || 'Failed to delete listing');
    }
  },

  getReports: async () => {
    try {
      const response = await apiClient.get('/admin/reports');
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      throw new Error(err.response?.data?.detail || 'Failed to fetch reports');
    }
  },

  resolveReport: async (id: number) => {
    try {
      const response = await apiClient.patch(`/admin/reports/${id}/resolve`);
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      throw new Error(err.response?.data?.detail || 'Failed to resolve report');
    }
  },
};

export default apiClient;

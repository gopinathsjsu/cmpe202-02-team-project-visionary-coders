export interface User {
  id: string;
  email: string;
  name: string;
  role: 'buyer' | 'seller' | 'admin';
  createdAt: Date;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface SignUpData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  role?: 'buyer' | 'seller' | 'admin';
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (data: SignInData) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
}

export interface Seller {
  id: number;
  name: string;
  email: string;
}

export interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  is_sold: boolean;
  photo_url?: string;
  location?: string;
  seller_id: number;
  seller?: Seller;
}

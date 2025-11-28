
export type User = {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  location: string;
  memberSince: string;
  rating: number;
  reviews: number;
  reviewsReceived: Review[];
};

export type Review = {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  rating: number;
  comment: string;
  date: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  location: {
    street: string;
    city: string;
    zipCode: string;
  };
  distance: number;
  images: string[];
  seller: User;
  postedDate: string;
};

export const CATEGORIES = [
  'Electronics',
  'Furniture',
  'Home & Garden',
  'Clothing & Accessories',
  'Musical Instruments',
  'Sporting Goods',
  'Toys & Games',
  'Books, Movies & Music',
];

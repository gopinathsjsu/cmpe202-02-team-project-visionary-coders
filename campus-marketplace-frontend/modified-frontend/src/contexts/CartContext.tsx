'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { cartAPI } from '@/lib/api';
import { useAuth } from './AuthContext';

interface CartItem {
    id: number;
    listing: {
        id: number;
        title: string;
        price: number;
        photo_url: string | null;
    };
}

interface CartContextType {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
    loading: boolean;
    addToCart: (listingId: number) => Promise<void>;
    removeFromCart: (itemId: number) => Promise<void>;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated } = useAuth();
    const [items, setItems] = useState<CartItem[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(false);

    const refreshCart = async () => {
        if (!isAuthenticated) {
            setItems([]);
            setTotalItems(0);
            setTotalPrice(0);
            return;
        }

        try {
            const data = await cartAPI.getCart();
            setItems(data.items);
            setTotalItems(data.total_items);
            setTotalPrice(data.total_price);
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        }
    };

    useEffect(() => {
        refreshCart();
    }, [isAuthenticated]);

    const addToCart = async (listingId: number) => {
        setLoading(true);
        try {
            const data = await cartAPI.addToCart(listingId);
            setItems(data.items);
            setTotalItems(data.total_items);
            setTotalPrice(data.total_price);
        } catch (error) {
            console.error('Failed to add to cart:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (itemId: number) => {
        setLoading(true);
        try {
            const data = await cartAPI.removeFromCart(itemId);
            setItems(data.items);
            setTotalItems(data.total_items);
            setTotalPrice(data.total_price);
        } catch (error) {
            console.error('Failed to remove from cart:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <CartContext.Provider value={{ items, totalItems, totalPrice, loading, addToCart, removeFromCart, refreshCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

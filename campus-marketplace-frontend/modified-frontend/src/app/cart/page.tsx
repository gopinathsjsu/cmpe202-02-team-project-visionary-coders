'use client';

import React, { useState } from 'react';
import { ArrowLeft, X, Minus, Plus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

const ShoppingCart = () => {
    const { items, removeFromCart, totalPrice, loading } = useCart();
    const [shippingCost, setShippingCost] = useState(5.00);

    const subtotal = totalPrice;
    const total = subtotal + shippingCost;

    if (loading && items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="flex flex-col md:flex-row">

                    {/* LEFT COLUMN: Cart Items */}
                    <div className="w-full md:w-3/4 p-8 bg-white">
                        <div className="flex justify-between items-center border-b pb-8">
                            <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
                            <h2 className="text-xl font-semibold text-gray-600">{items.length} Items</h2>
                        </div>

                        {/* Table Header (Hidden on small mobile) */}
                        <div className="hidden md:flex mt-10 mb-5 text-xs font-bold text-gray-400 uppercase">
                            <h3 className="w-2/5">Product Details</h3>
                            <h3 className="w-1/5 text-center">Quantity</h3>
                            <h3 className="w-1/5 text-center">Price</h3>
                            <h3 className="w-1/5 text-center">Total</h3>
                        </div>

                        {/* Items List */}
                        {items.length === 0 ? (
                            <div className="py-10 text-center text-gray-500">
                                Your cart is empty.
                            </div>
                        ) : (
                            items.map((item) => (
                                <div key={item.id} className="flex flex-col md:flex-row items-center hover:bg-gray-50 -mx-8 px-6 py-5">

                                    {/* Product Details */}
                                    <div className="flex w-full md:w-2/5">
                                        <div className="w-20 h-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                            {item.listing.photo_url ? (
                                                <img
                                                    className="h-full w-full object-cover object-center"
                                                    src={item.listing.photo_url.startsWith('http') ? item.listing.photo_url : `http://localhost:8000${item.listing.photo_url}`}
                                                    alt={item.listing.title}
                                                />
                                            ) : (
                                                <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                    No Img
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col justify-between ml-4 flex-grow">
                                            <span className="font-bold text-sm text-gray-800">{item.listing.title}</span>
                                            <span className="text-red-500 text-xs font-bold">Item #{item.listing.id}</span>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="font-semibold hover:text-red-500 text-gray-400 text-xs text-left transition duration-200"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>

                                    {/* Quantity */}
                                    <div className="flex justify-center w-full md:w-1/5 mt-4 md:mt-0">
                                        <span className="mx-2 border text-center w-12 bg-white text-gray-700 py-1">
                                            1
                                        </span>
                                    </div>

                                    {/* Price */}
                                    <span className="text-center w-full md:w-1/5 font-semibold text-sm text-gray-600 mt-4 md:mt-0">
                                        ${item.listing.price.toFixed(2)}
                                    </span>

                                    {/* Total per Item */}
                                    <span className="text-center w-full md:w-1/5 font-semibold text-sm text-gray-800 mt-4 md:mt-0">
                                        ${item.listing.price.toFixed(2)}
                                    </span>
                                </div>
                            ))
                        )}

                        <Link href="/marketplace" className="flex font-semibold text-purple-600 text-sm mt-10 items-center hover:text-purple-800 transition">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Continue Shopping
                        </Link>
                    </div>

                    {/* RIGHT COLUMN: Order Summary */}
                    <div className="w-full md:w-1/4 px-8 py-10 bg-gray-50">
                        <h1 className="font-semibold text-2xl border-b pb-8 text-gray-800">Order Summary</h1>

                        <div className="flex justify-between mt-10 mb-5">
                            <span className="font-semibold text-sm uppercase text-gray-600">Items {items.length}</span>
                            <span className="font-semibold text-sm text-gray-600">${subtotal.toFixed(2)}</span>
                        </div>

                        <div>
                            <label className="font-medium inline-block mb-3 text-sm uppercase text-gray-600">Shipping</label>
                            <select
                                className="block p-2 text-gray-600 w-full text-sm bg-white border rounded-sm outline-none"
                                onChange={(e) => setShippingCost(parseFloat(e.target.value))}
                                value={shippingCost}
                            >
                                <option value="5.00">Standard Delivery - $5.00</option>
                                <option value="10.00">Express Delivery - $10.00</option>
                            </select>
                        </div>

                        <div className="py-10">
                            <label htmlFor="promo" className="font-semibold inline-block mb-3 text-sm uppercase text-gray-600">
                                Promo Code
                            </label>
                            <input
                                type="text"
                                id="promo"
                                placeholder="Enter your code"
                                className="p-2 text-sm w-full outline-none border rounded-sm mb-4"
                            />
                            <button className="bg-red-500 hover:bg-red-600 px-5 py-2 text-sm text-white uppercase font-bold transition">
                                Apply
                            </button>
                        </div>

                        <div className="border-t mt-8">
                            <div className="flex font-semibold justify-between py-6 text-sm uppercase text-gray-800">
                                <span>Total Cost</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <button className="bg-purple-600 font-semibold hover:bg-purple-700 py-3 text-sm text-white uppercase w-full transition duration-200">
                                Checkout
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ShoppingCart;
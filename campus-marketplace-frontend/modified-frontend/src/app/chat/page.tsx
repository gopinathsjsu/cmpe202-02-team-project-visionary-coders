'use client';

import { useState, useEffect, useRef } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { chatAPI } from '@/lib/api';
import { useSearchParams } from 'next/navigation';

interface Message {
    room_id: string;
    sender_id: number;
    receiver_id: number;
    content: string;
}

interface Conversation {
    room_id: string;
    other_user_name: string;
    last_message: string;
    last_message_at: string;
}

export default function ChatPage() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const initialRoomId = searchParams.get('room');

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeRoom, setActiveRoom] = useState<string | null>(initialRoomId);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchConversations();
        const interval = setInterval(fetchConversations, 10000); // Poll conversations every 10s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (activeRoom) {
            fetchHistory(activeRoom);
            const interval = setInterval(() => fetchHistory(activeRoom), 3000); // Poll messages every 3s
            return () => clearInterval(interval);
        }
    }, [activeRoom]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchConversations = async () => {
        try {
            const data = await chatAPI.getConversations();
            setConversations(data);
            if (data.length > 0 && !activeRoom && !initialRoomId) {
                // setActiveRoom(data[0].room_id); // Don't auto-select to keep UI clean
            }
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async (roomId: string) => {
        try {
            const data = await chatAPI.getHistory(roomId);
            setMessages(data.messages);
        } catch (error) {
            console.error('Failed to fetch history:', error);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeRoom || !user) return;

        try {
            // Parse receiver ID from room ID (listing-listingId-buyerId-sellerId)
            const parts = activeRoom.split('-');
            if (parts.length < 4) return;

            const buyerId = parseInt(parts[2]);
            const sellerId = parseInt(parts[3]);
            const receiverId = user.id === String(buyerId) ? sellerId : buyerId;

            await chatAPI.sendMessage(activeRoom, receiverId, newMessage);
            setNewMessage('');
            fetchHistory(activeRoom); // Refresh immediately
        } catch (error) {
            console.error('Failed to send message:', error);
            alert('Failed to send message');
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8 h-[calc(100vh-64px)]">
                <div className="max-w-7xl mx-auto h-full flex gap-6">
                    {/* Conversations List */}
                    <div className="w-1/3 bg-white shadow rounded-lg overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {loading ? (
                                <div className="p-4 text-center text-gray-500">Loading...</div>
                            ) : conversations.length === 0 ? (
                                <div className="p-4 text-center text-gray-500">No conversations yet.</div>
                            ) : (
                                conversations.map((conv) => (
                                    <button
                                        key={conv.room_id}
                                        onClick={() => setActiveRoom(conv.room_id)}
                                        className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${activeRoom === conv.room_id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : ''
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-medium text-gray-900">{conv.other_user_name}</h3>
                                            <span className="text-xs text-gray-500">
                                                {new Date(conv.last_message_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 truncate">{conv.last_message}</p>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chat Window */}
                    <div className="flex-1 bg-white shadow rounded-lg overflow-hidden flex flex-col">
                        {activeRoom ? (
                            <>
                                <div className="p-4 border-b border-gray-200 bg-gray-50">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Chat with {conversations.find(c => c.room_id === activeRoom)?.other_user_name || 'User'}
                                    </h2>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {messages.map((msg, index) => {
                                        const isMe = String(msg.sender_id) === user?.id;
                                        return (
                                            <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[70%] rounded-lg px-4 py-2 ${isMe ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-900'
                                                    }`}>
                                                    <p>{msg.content}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                <div className="p-4 border-t border-gray-200">
                                    <form onSubmit={handleSendMessage} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type a message..."
                                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!newMessage.trim()}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                        >
                                            Send
                                        </button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-500">
                                Select a conversation to start chatting
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

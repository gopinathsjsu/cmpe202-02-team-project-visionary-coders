'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { chatAPI, listingAPI } from '@/lib/api';

interface ChatRoom {
  id: number;
  buyer_id: number;
  seller_id: number;
  listing_id: number;
  created_at: string;
  updated_at: string;
  last_message: string | null;
}

interface ListingInfo {
  id: number;
  title: string;
  price: number;
}

interface ChatRoomWithDetails extends ChatRoom {
  listing?: ListingInfo;
  otherUserName?: string;
}

export default function ChatListPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<ChatRoomWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pinnedChats, setPinnedChats] = useState<number[]>([]);

  useEffect(() => {
    // Load pinned chats from localStorage
    const stored = localStorage.getItem('pinnedChats');
    if (stored) {
      setPinnedChats(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const chatRooms = await chatAPI.getRooms();
        
        // Fetch listing details for each room
        const roomsWithDetails = await Promise.all(
          chatRooms.map(async (room: ChatRoom) => {
            try {
              const listing = await listingAPI.getListingById(room.listing_id.toString());
              return {
                ...room,
                listing,
              };
            } catch {
              return room;
            }
          })
        );

        setRooms(roomsWithDetails);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load chat rooms');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const handleDeleteChat = async (roomId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!globalThis.confirm('Are you sure you want to delete this chat?')) {
      return;
    }
    
    try {
      await chatAPI.deleteRoom(roomId);
      setRooms(rooms.filter((room) => room.id !== roomId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete chat');
    }
  };

  const handlePinChat = (roomId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = pinnedChats.includes(roomId)
      ? pinnedChats.filter((id) => id !== roomId)
      : [...pinnedChats, roomId];
    setPinnedChats(updated);
    localStorage.setItem('pinnedChats', JSON.stringify(updated));
  };

  // Sort rooms: pinned first, then by most recent
  const sortedRooms = [...rooms].sort((a, b) => {
    const aPinned = pinnedChats.includes(a.id);
    const bPinned = pinnedChats.includes(b.id);
    
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push('/')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-600"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                  <p className="text-base text-gray-500">Chat with buyers and sellers</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {rooms.length === 0 ? (
            <div className="text-center py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12 text-gray-400 mx-auto mb-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 00.865-.501c1.054-.086 2.294-.213 3.423-.379 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">No messages yet</h3>
              <p className="text-gray-500">Contact a seller to start a conversation</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedRooms.map((room) => (
                <div
                  key={room.id}
                  className="relative bg-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all group"
                >
                  {pinnedChats.includes(room.id) && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-base font-bold px-2 py-1 rounded-full">
                      📌
                    </div>
                  )}
                  
                  <button
                    onClick={() => router.push(`/chat/${room.id}`)}
                    className="w-full text-left p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{room.listing?.title || 'Loading...'}</h3>
                        <p className="text-base text-gray-500 mt-0.5">
                          ${room.listing?.price || 'N/A'}
                        </p>
                      </div>
                      <span className="text-base text-gray-500 ml-2">{formatTime(room.updated_at)}</span>
                    </div>
                    
                    <p className="text-gray-600 text-base truncate">
                      {room.last_message || 'No messages yet'}
                    </p>
                  </button>

                  {/* Action buttons - visible on hover */}
                  <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handlePinChat(room.id, e)}
                      className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                      title={pinnedChats.includes(room.id) ? 'Unpin chat' : 'Pin chat'}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={pinnedChats.includes(room.id) ? 'currentColor' : 'none'}
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                    
                    <button
                      onClick={(e) => handleDeleteChat(room.id, e)}
                      className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      title="Delete chat"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

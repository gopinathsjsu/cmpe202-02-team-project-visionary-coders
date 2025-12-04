'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { chatAPI, listingAPI } from '@/lib/api';
import { Listing } from '@/types/auth';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: number;
  room_id: number;
  sender_id: number;
  content: string;
  sent_at: string;
}

interface ChatRoom {
  id: number;
  buyer_id: number;
  seller_id: number;
  listing_id: number;
  created_at: string;
  updated_at: string;
  last_message: string | null;
}

// Use shared Listing type from `@/types/auth` for consistency

export default function ChatRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = Number(params.id);

  const [listing, setListing] = useState<Listing | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [sendingOffer, setSendingOffer] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);

        // Fetch room data
        try {
          const roomData = await chatAPI.getRoom(roomId);

          // Mark this chat as viewed
          const viewedChats = JSON.parse(localStorage.getItem('viewedChats') || '[]');
          if (!viewedChats.includes(roomId)) {
            viewedChats.push(roomId);
            localStorage.setItem('viewedChats', JSON.stringify(viewedChats));
            // Trigger header update to refresh unread count
            globalThis.dispatchEvent(new Event('chatViewed'));
          }

          // Fetch listing using room's listing_id
          try {
            const listingData = await listingAPI.getListingById(roomData.listing_id.toString());
            setListing(listingData);
          } catch (err) {
            console.error('Failed to fetch listing:', err);
          }

          // Fetch messages (will be empty for new rooms)
          try {
            const messagesData = await chatAPI.getMessages(roomId);
            setMessages(messagesData || []);
          } catch (err) {
            console.error('Failed to fetch messages:', err);
            setMessages([]); // Show empty chat instead of error
          }
        } catch (err) {
          console.error('Room not found, might be newly created:', err);
          // If room doesn't exist yet, still show empty chat
          setMessages([]);
        }

        setError('');
      } catch (err) {
        console.error('Error loading chat:', err);
        setError(err instanceof Error ? err.message : 'Failed to load chat');
      } finally {
        setLoading(false);
      }
    };

    if (roomId) {
      fetchRoomData();
    }
  }, [roomId]);

  const { user } = useAuth(); // Get current user

  const handleSendMessage = async () => {
    if (!messageText.trim() || !user) return;

    try {
      setSending(true);
      const newMessage = await chatAPI.sendMessage(roomId, messageText, parseInt(user.id.toString()));
      setMessages([...messages, newMessage]);
      setMessageText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleSendOffer = async () => {
    if (!offerPrice.trim() || !user) return;

    try {
      setSendingOffer(true);
      const offerContent = `🏷️ OFFER: $${offerPrice}${offerMessage ? ` - ${offerMessage}` : ''}`;
      const newMessage = await chatAPI.sendMessage(roomId, offerContent, parseInt(user.id.toString()));
      setMessages([...messages, newMessage]);
      setOfferPrice('');
      setOfferMessage('');
      setShowOfferModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send offer');
    } finally {
      setSendingOffer(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() => router.push('/chat')}
                className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Back to Chats
              </button>

              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900">{listing?.title || 'Chat'}</h1>
                <p className="text-base text-gray-500">{listing?.price ? `$${listing.price}` : ''}</p>
              </div>

              <div className="flex gap-2">
                {listing && (
                  <button
                    onClick={() => router.push(`/listings/${listing.id}`)}
                    className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 whitespace-nowrap"
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
                        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                      />
                    </svg>
                    Product Details
                  </button>
                )}

                {listing?.photo_url && (
                  <img
                    src={listing.photo_url}
                    alt={listing.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => {
              const isCurrentUser = user && parseInt(user.id.toString()) === message.sender_id;
              return (
                <div
                  key={message.id}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${isCurrentUser
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-900 rounded-bl-none'
                      }`}
                  >
                    <p className="break-words">{message.content}</p>
                    <p className={`text-base mt-1 ${isCurrentUser ? 'text-indigo-100' : 'text-gray-600'
                      }`}>
                      {formatTime(message.sent_at)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 sticky bottom-0">
          <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-3">
                <p className="text-red-700 text-base">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                disabled={sending}
              />
              <button
                onClick={handleSendMessage}
                disabled={sending || !messageText.trim()}
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? 'Sending...' : 'Send'}
              </button>
              <button
                onClick={() => setShowOfferModal(true)}
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                Make an Offer
              </button>
            </div>
          </div>
        </div>

        {/* Make an Offer Modal */}
        {showOfferModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full shadow-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Make an Offer</h2>
              </div>

              <div className="px-6 py-4 space-y-4">
                <div>
                  <label htmlFor="offerPrice" className="block text-base font-medium text-gray-700 mb-1">
                    Offer Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-600">$</span>
                    <input
                      id="offerPrice"
                      type="number"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                      placeholder="Enter your offer"
                      className="w-full pl-6 pr-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="offerMessage" className="block text-base font-medium text-gray-700 mb-1">
                    Message (Optional)
                  </label>
                  <textarea
                    id="offerMessage"
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                    placeholder="Add a message with your offer..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
                    rows={3}
                  />
                </div>

                {listing && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-base text-gray-600">
                      <span className="font-semibold">Item:</span> {listing.title}
                    </p>
                    <p className="text-base text-gray-600">
                      <span className="font-semibold">Original Price:</span> ${listing.price}
                    </p>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => {
                    setShowOfferModal(false);
                    setOfferPrice('');
                    setOfferMessage('');
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendOffer}
                  disabled={sendingOffer || !offerPrice.trim()}
                  className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendingOffer ? 'Sending...' : 'Send Offer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

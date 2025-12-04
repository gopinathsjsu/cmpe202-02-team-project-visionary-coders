from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class MessageCreate(BaseModel):
    content: str
    sender_id: int

class MessagePublic(BaseModel):
    id: int
    room_id: int
    sender_id: int
    content: str
    sent_at: datetime

class ChatRoomCreate(BaseModel):
    listing_id: int
    seller_id: int
    buyer_id: int

class ChatRoomPublic(BaseModel):
    id: int
    buyer_id: int
    seller_id: int
    listing_id: int
    created_at: datetime
    updated_at: datetime
    last_message: Optional[str] = None

class ChatRoomWithMessages(ChatRoomPublic):
    messages: List[MessagePublic] = []

# Kept for backward compatibility with WebSocket
class ChatMessage(BaseModel):
    room_id: int
    sender_id: int
    content: str

class ChatHistory(BaseModel):
    room_id: int
    messages: List[MessagePublic]

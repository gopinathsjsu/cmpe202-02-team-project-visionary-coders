from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from sqlmodel import Session, select
from app.db.session import get_session
from app.deps import get_current_user
from app.models.user import User
from app.models.chat_room import ChatRoom
from app.models.message import Message
from app.schemas.chat import (
    ChatRoomCreate, ChatRoomPublic, ChatRoomWithMessages,
    MessageCreate, MessagePublic, ChatHistory
)
from datetime import datetime

router = APIRouter(tags=["chat"])

@router.get("/rooms", response_model=List[ChatRoomPublic])
def get_user_chat_rooms(
    session: Session = Depends(get_session)
):
    """Get all chat rooms"""
    rooms = session.exec(
        select(ChatRoom).order_by(ChatRoom.updated_at.desc())
    ).all()
    return rooms

@router.get("/rooms/{room_id}", response_model=ChatRoomPublic)
def get_chat_room(
    room_id: int,
    session: Session = Depends(get_session)
):
    """Get specific chat room"""
    room = session.get(ChatRoom, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Chat room not found")
    
    return room

@router.get("/rooms/{room_id}/messages", response_model=List[MessagePublic])
def get_room_messages(
    room_id: int,
    limit: int = 50,
    offset: int = 0,
    session: Session = Depends(get_session)
):
    """Get messages for a chat room (paginated)"""
    room = session.get(ChatRoom, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Chat room not found")
    
    messages = session.exec(
        select(Message)
        .where(Message.room_id == room_id)
        .order_by(Message.sent_at.desc())
        .offset(offset)
        .limit(limit)
    ).all()
    
    # Return in chronological order
    return list(reversed(messages))

@router.post("/rooms", response_model=ChatRoomPublic)
def get_or_create_room(
    payload: ChatRoomCreate,
    session: Session = Depends(get_session)
):
    """Get existing or create new chat room between buyer and seller"""
    # Check if room already exists
    existing_room = session.exec(
        select(ChatRoom).where(
            (ChatRoom.listing_id == payload.listing_id) &
            (ChatRoom.seller_id == payload.seller_id)
        )
    ).first()
    
    if existing_room:
        return existing_room
    
    # Create new room
    new_room = ChatRoom(
        buyer_id=payload.buyer_id,
        seller_id=payload.seller_id,
        listing_id=payload.listing_id
    )
    session.add(new_room)
    session.commit()
    session.refresh(new_room)
    
    return new_room

@router.post("/rooms/{room_id}/messages", response_model=MessagePublic)
def send_message(
    room_id: int,
    payload: MessageCreate,
    session: Session = Depends(get_session)
):
    """Send a message in a chat room"""
    room = session.get(ChatRoom, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Chat room not found")
    
    # Create message
    message = Message(
        room_id=room_id,
        sender_id=payload.sender_id,
        content=payload.content
    )
    session.add(message)
    
    # Update room's last_message and updated_at
    room.last_message = payload.content
    room.updated_at = datetime.utcnow()
    session.add(room)
    
    session.commit()
    session.refresh(message)
    
    return message

@router.delete("/rooms/{room_id}")
def delete_chat_room(
    room_id: int,
    session: Session = Depends(get_session)
):
    """Delete a chat room"""
    room = session.get(ChatRoom, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Chat room not found")
    
    # Delete all messages in the room first
    messages = session.exec(select(Message).where(Message.room_id == room_id)).all()
    for msg in messages:
        session.delete(msg)
    
    # Delete room
    session.delete(room)
    session.commit()
    
    return {"message": "Chat room deleted successfully"}

# Legacy endpoint for backward compatibility
@router.get("/rooms/{room_id}/history", response_model=ChatHistory)
def get_history(room_id: int, session: Session = Depends(get_session)):
    room = session.get(ChatRoom, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Chat room not found")
    
    msgs = session.exec(select(Message).where(Message.room_id==room_id).order_by(Message.sent_at.asc())).all()
    return ChatHistory(room_id=room_id, messages=msgs)

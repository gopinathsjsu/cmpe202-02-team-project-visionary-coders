from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlmodel import Session, select
from app.db.session import get_session
from app.deps import get_current_user
from app.models.message import Message
from app.schemas.chat import ChatHistory, SendMessageRequest, ChatMessage
from app.models.user import User

router = APIRouter()

@router.get("/rooms/{room_id}/history", response_model=ChatHistory)
def get_history(room_id: str, session: Session = Depends(get_session), user=Depends(get_current_user)):
    msgs = session.exec(select(Message).where(Message.room_id==room_id).order_by(Message.sent_at.asc())).all()
    return ChatHistory(room_id=room_id, messages=[ChatMessage(room_id=m.room_id, sender_id=m.sender_id, receiver_id=m.receiver_id, content=m.content) for m in msgs])

@router.post("/send", response_model=ChatMessage)
def send_message(payload: SendMessageRequest, session: Session = Depends(get_session), user=Depends(get_current_user)):
    msg = Message(room_id=payload.room_id, sender_id=user.id, receiver_id=payload.receiver_id, content=payload.content)
    session.add(msg); session.commit(); session.refresh(msg)
    return ChatMessage(room_id=msg.room_id, sender_id=msg.sender_id, receiver_id=msg.receiver_id, content=msg.content)

@router.get("/conversations", response_model=List[dict])
def list_conversations(session: Session = Depends(get_session), user=Depends(get_current_user)):
    # Find distinct room_ids where user is sender or receiver
    # SQLModel doesn't support distinct() well on select(), so we'll fetch all relevant messages and process in python for now (not efficient but works for MVP)
    msgs = session.exec(select(Message).where((Message.sender_id == user.id) | (Message.receiver_id == user.id)).order_by(Message.sent_at.desc())).all()
    
    rooms = {}
    for m in msgs:
        if m.room_id not in rooms:
            other_id = m.receiver_id if m.sender_id == user.id else m.sender_id
            other_user = session.get(User, other_id)
            rooms[m.room_id] = {
                "room_id": m.room_id,
                "other_user_name": other_user.name if other_user else "Unknown",
                "last_message": m.content,
                "last_message_at": m.sent_at
            }
    
    return list(rooms.values())

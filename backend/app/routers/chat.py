from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlmodel import Session, select
from app.db.session import get_session
from app.deps import get_current_user
from app.models.message import Message
from app.schemas.chat import ChatHistory

router = APIRouter()

@router.get("/rooms/{room_id}/history", response_model=ChatHistory)
def get_history(room_id: str, session: Session = Depends(get_session), user=Depends(get_current_user)):
    msgs = session.exec(select(Message).where(Message.room_id==room_id).order_by(Message.sent_at.asc())).all()
    return ChatHistory(room_id=room_id, messages=[{"room_id": m.room_id, "sender_id": m.sender_id, "content": m.content} for m in msgs])

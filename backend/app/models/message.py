from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Message(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    room_id: int = Field(foreign_key="chatroom.id", index=True)
    sender_id: int = Field(foreign_key="user.id", index=True)
    content: str
    sent_at: datetime = Field(default_factory=datetime.utcnow, index=True)

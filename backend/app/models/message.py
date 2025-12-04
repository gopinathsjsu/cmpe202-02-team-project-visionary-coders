from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Message(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    room_id: str = Field(index=True)
    sender_id: int
<<<<<<< HEAD
    receiver_id: int
=======
>>>>>>> origin/main
    content: str
    sent_at: datetime = Field(default_factory=datetime.utcnow)

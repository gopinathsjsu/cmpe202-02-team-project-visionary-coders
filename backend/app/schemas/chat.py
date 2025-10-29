from pydantic import BaseModel
from typing import List

class ChatMessage(BaseModel):
    room_id: str
    sender_id: int
    content: str

class ChatHistory(BaseModel):
    room_id: str
    messages: List[ChatMessage]

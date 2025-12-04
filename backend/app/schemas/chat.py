from pydantic import BaseModel
from typing import List

class ChatMessage(BaseModel):
    room_id: str
    sender_id: int
    receiver_id: int
    content: str

class ChatHistory(BaseModel):
    room_id: str
    messages: List[ChatMessage]

class SendMessageRequest(BaseModel):
    room_id: str
    receiver_id: int
    content: str

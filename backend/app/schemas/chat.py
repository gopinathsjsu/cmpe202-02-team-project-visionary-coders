from pydantic import BaseModel
from typing import List

class ChatMessage(BaseModel):
    room_id: str
    sender_id: int
<<<<<<< HEAD
    receiver_id: int
=======
>>>>>>> origin/main
    content: str

class ChatHistory(BaseModel):
    room_id: str
    messages: List[ChatMessage]
<<<<<<< HEAD

class SendMessageRequest(BaseModel):
    room_id: str
    receiver_id: int
    content: str
=======
>>>>>>> origin/main

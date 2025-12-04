from fastapi import WebSocket
from typing import Dict, List
from sqlmodel import Session
from app.db.session import engine
from app.models.message import Message

class ConnectionManager:
    def __init__(self):
        self.rooms: Dict[str, List[WebSocket]] = {}

    async def connect(self, room_id: str, websocket: WebSocket):
        await websocket.accept()
        self.rooms.setdefault(room_id, []).append(websocket)

    def disconnect(self, room_id: str, websocket: WebSocket):
        if room_id in self.rooms:
            self.rooms[room_id].remove(websocket)

    async def broadcast(self, room_id: str, data: dict):
        # Persist message
        msg = Message(room_id=room_id, sender_id=int(data.get("sender_id", 0)), content=str(data.get("content","")))
        with Session(engine) as session:
            session.add(msg); session.commit()
        # Fan out
        for ws in list(self.rooms.get(room_id, [])):
            await ws.send_json({"room_id": room_id, "sender_id": msg.sender_id, "content": msg.content})

manager = ConnectionManager()

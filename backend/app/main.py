from fastapi import FastAPI, Depends, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.db.session import create_db_and_tables
from app.db.seed_data import run as seed_db
from app.routers import auth, users, listings, chat, admin, search
from app.services.chat_manager import manager

app = FastAPI(title="Campus Marketplace API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving for uploaded images (local dev)
app.mount("/media", StaticFiles(directory=settings.MEDIA_DIR), name="media")

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(listings.router, prefix="/listings", tags=["Listings"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(search.router, prefix="/search", tags=["Search"])

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    seed_db()

# WebSocket endpoint for chat
@app.websocket("/ws/chat/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await manager.connect(room_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            await manager.broadcast(room_id, data)
    except WebSocketDisconnect:
        manager.disconnect(room_id, websocket)

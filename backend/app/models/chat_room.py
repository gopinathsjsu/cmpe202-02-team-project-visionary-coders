from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class ChatRoom(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    buyer_id: int = Field(foreign_key="user.id", index=True)
    seller_id: int = Field(foreign_key="user.id", index=True)
    listing_id: int = Field(foreign_key="listing.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_message: Optional[str] = None
    
    # Composite unique constraint would go in migration/alembic
    # For now, we'll check in the service layer

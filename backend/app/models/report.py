from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Report(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    listing_id: int
    reporter_id: int
    reason: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    resolved: bool = Field(default=False)

from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from enum import Enum
from datetime import datetime

class Category(str, Enum):
    textbooks = "textbooks"
    gadgets = "gadgets"
    essentials = "essentials"
    none = "none"

class Listing(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: str
    price: float = Field(gt=0)
    photo_url: Optional[str] = None
    category: Category = Field(default=Category.none)
    is_sold: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    seller_id: int = Field(foreign_key="user.id")
    seller: "User" = Relationship(back_populates="listings")

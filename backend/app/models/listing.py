from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from enum import Enum
from datetime import datetime

class Category(str, Enum):
    textbooks = "textbooks"
    gadgets = "gadgets"
    essentials = "essentials"
    furniture = "furniture"
    clothing = "clothing"
    sports = "sports"
    none = "none"

class ListingStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"
class Listing(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: str
    price: float = Field(gt=0)
    photo_url: Optional[str] = None
    location: Optional[str] = None  # e.g., "Engineering Building, Room 101"
    category: Category = Field(default=Category.none)
    status: ListingStatus = Field(default=ListingStatus.pending)
    is_sold: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    seller_id: int = Field(foreign_key="user.id")
    seller: "User" = Relationship(back_populates="listings")

from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime
from app.models.user import User
from app.models.listing import Listing

class Cart(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    user: "User" = Relationship(back_populates="cart")
    items: List["CartItem"] = Relationship(back_populates="cart")

class CartItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    cart_id: int = Field(foreign_key="cart.id")
    listing_id: int = Field(foreign_key="listing.id")
    added_at: datetime = Field(default_factory=datetime.utcnow)

    cart: "Cart" = Relationship(back_populates="items")
    listing: "Listing" = Relationship()

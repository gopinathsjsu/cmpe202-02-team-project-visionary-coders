from pydantic import BaseModel
from typing import List, Optional
from app.schemas.listing import ListingPublic

class CartItemPublic(BaseModel):
    id: int
    listing: ListingPublic

class CartPublic(BaseModel):
    id: int
    items: List[CartItemPublic]
    total_items: int
    total_price: float

from pydantic import BaseModel, Field
from typing import Optional, Literal

class ListingCreate(BaseModel):
    title: str = Field(min_length=2)
    description: str = Field(min_length=2)
    price: float = Field(gt=0)
    category: Optional[Literal["textbooks","gadgets","essentials","furniture","clothing","sports","none"]] = "none"
    photo_url: Optional[str] = None

class ListingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = Field(default=None, gt=0)
    category: Optional[Literal["textbooks","gadgets","essentials","furniture","clothing","sports","none"]] = None
    photo_url: Optional[str] = None
    is_sold: Optional[bool] = None

class ListingPublic(BaseModel):
    id: int
    title: str
    description: str
    price: float
    category: str
    is_sold: bool
    photo_url: Optional[str] = None
    seller_id: int

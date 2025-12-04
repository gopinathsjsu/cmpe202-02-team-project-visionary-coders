from pydantic import BaseModel, Field
from typing import Optional, Literal

class ListingCreate(BaseModel):
    title: str = Field(min_length=2)
    description: str = Field(min_length=2)
    price: float = Field(gt=0)
    category: Optional[Literal["textbooks","gadgets","essentials","none"]] = "none"
    photo_url: Optional[str] = None

class ListingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = Field(default=None, gt=0)
    category: Optional[Literal["textbooks","gadgets","essentials","none"]] = None
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

class SellerInfo(BaseModel):
    id: int
    name: str
    email: str

class ListingWithSeller(BaseModel):
    id: int
    title: str
    description: str
    price: float
    category: str
    is_sold: bool
    photo_url: Optional[str] = None
    seller_id: int
    seller: SellerInfo

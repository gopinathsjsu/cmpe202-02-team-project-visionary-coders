from datetime import datetime
from pydantic import BaseModel
from typing import Literal, Optional


class AdminSummary(BaseModel):
    total_users: int
    total_sellers: int
    total_admins: int
    total_listings: int
    pending_listings: int
    approved_listings: int
    rejected_listings: int
    sold_items: int
    generated_at: datetime


class ListingStatusUpdate(BaseModel):
    status: Optional[Literal["pending", "approved", "rejected"]] = None
    is_sold: Optional[bool] = None


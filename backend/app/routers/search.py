from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List
from sqlmodel import Session, select
from app.db.session import get_session
from app.models.listing import Listing, Category
from app.schemas.listing import ListingPublic
from app.services.nl_search import nl_to_query

router = APIRouter()

class NLQuery(BaseModel):
    question: str

@router.post("/nl", response_model=List[ListingPublic])
def nl_search(payload: NLQuery, session: Session = Depends(get_session)):
    filters = nl_to_query(payload.question)
    
    stmt = select(Listing)
    
    # 1. Apply Category Filter
    if filters["category"]:
        # We need to ensure the category string matches the Enum
        try:
            stmt = stmt.where(Listing.category == Category(filters["category"]))
        except ValueError:
            pass # Ignore invalid categories

    # 2. Apply Price Filter
    if filters["max_price"]:
        stmt = stmt.where(Listing.price <= filters["max_price"])

    # 3. Apply Keywords
    # We want listings that match ALL keywords (AND logic)
    # But for each keyword, it can be in title OR description
    for kw in filters["keywords"]:
        like = f"%{kw.lower()}%"
        stmt = stmt.where((Listing.title.ilike(like)) | (Listing.description.ilike(like)))

    results = session.exec(stmt.order_by(Listing.created_at.desc())).all()
    return [ListingPublic(id=i.id, title=i.title, description=i.description, price=i.price, category=i.category.value, is_sold=i.is_sold, photo_url=i.photo_url, seller_id=i.seller_id) for i in results]

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from typing import List, Optional
from sqlmodel import Session, select
from app.db.session import get_session
from app.models.listing import Listing, Category, ListingStatus
from app.schemas.listing import ListingPublic
from app.services.nl_search import nl_to_query

router = APIRouter()

class NLQuery(BaseModel):
    question: str

@router.post("/nl", response_model=List[ListingPublic])
def nl_search(payload: NLQuery, session: Session = Depends(get_session)):
    """Natural language search - Example: 'cheap laptop under $500'"""
    filters = nl_to_query(payload.question)
    return _apply_filters(filters, session)

@router.get("/advanced", response_model=List[ListingPublic])
def advanced_search(
    category: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    sort_by: str = Query("recent"),
    limit: int = Query(50),
    offset: int = Query(0),
    session: Session = Depends(get_session)
):
    """Advanced search with filters"""
    filters = {
        "keywords": [],
        "category": category,
        "min_price": min_price,
        "max_price": max_price,
        "sort_by": sort_by
    }
    return _apply_filters(filters, session, limit, offset)

def _apply_filters(filters: dict, session: Session, limit: int = 50, offset: int = 0):
    """Core filtering logic"""
    stmt = select(Listing).where(Listing.status == ListingStatus.approved)
    
    # Category filter
    if filters.get("category"):
        try:
            stmt = stmt.where(Listing.category == Category(filters["category"]))
        except:
            pass
    
    # Price filters
    if filters.get("min_price") is not None:
        stmt = stmt.where(Listing.price >= filters["min_price"])
    if filters.get("max_price") is not None:
        stmt = stmt.where(Listing.price <= filters["max_price"])
    
    # Keyword filters
    for keyword in filters.get("keywords", []):
        if keyword.strip():
            like = f"%{keyword.lower()}%"
            stmt = stmt.where(
                (Listing.title.ilike(like)) | (Listing.description.ilike(like))
            )
    
    # Sorting
    sort_by = filters.get("sort_by", "recent")
    if sort_by == "price_asc":
        stmt = stmt.order_by(Listing.price.asc())
    elif sort_by == "price_desc":
        stmt = stmt.order_by(Listing.price.desc())
    else:
        stmt = stmt.order_by(Listing.created_at.desc())
    
    # Pagination
    results = session.exec(stmt.offset(offset).limit(limit)).all()
    
    return [
        ListingPublic(
            id=r.id, title=r.title, description=r.description,
            price=r.price, category=r.category.value, is_sold=r.is_sold,
            photo_url=r.photo_url, seller_id=r.seller_id
        ) for r in results
    ]

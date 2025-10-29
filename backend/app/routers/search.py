from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List
from sqlmodel import Session, select
from app.db.session import get_session
from app.models.listing import Listing
from app.schemas.listing import ListingPublic
from app.services.nl_search import nl_to_keywords

router = APIRouter()

class NLQuery(BaseModel):
    question: str

@router.post("/nl", response_model=List[ListingPublic])
def nl_search(payload: NLQuery, session: Session = Depends(get_session)):
    keywords = nl_to_keywords(payload.question)
    stmt = select(Listing)
    for kw in keywords:
        like = f"%{kw.lower()}%"
        stmt = stmt.where((Listing.title.ilike(like)) | (Listing.description.ilike(like)))
    results = session.exec(stmt).all()
    return [ListingPublic(id=i.id, title=i.title, description=i.description, price=i.price, category=i.category.value, is_sold=i.is_sold, photo_url=i.photo_url, seller_id=i.seller_id) for i in results]

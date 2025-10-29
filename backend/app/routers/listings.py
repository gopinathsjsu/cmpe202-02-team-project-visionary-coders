from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from typing import Optional, List
from sqlmodel import Session, select
from app.db.session import get_session
from app.deps import get_current_user, require_role
from app.models.user import Role, User
from app.models.listing import Listing, Category
from app.schemas.listing import ListingCreate, ListingUpdate, ListingPublic
from app.core.config import settings
import os, uuid, shutil

router = APIRouter()

@router.get("", response_model=List[ListingPublic])
def list_listings(q: Optional[str] = None, category: Optional[str] = None, min_price: Optional[float] = None, max_price: Optional[float] = None, session: Session = Depends(get_session)):
    stmt = select(Listing)
    if q:
        like = f"%{q.lower()}%"
        stmt = stmt.where((Listing.title.ilike(like)) | (Listing.description.ilike(like)))
    if category in [c.value for c in Category] if category else False:
        stmt = stmt.where(Listing.category == Category(category))
    if min_price is not None:
        stmt = stmt.where(Listing.price >= min_price)
    if max_price is not None:
        stmt = stmt.where(Listing.price <= max_price)
    items = session.exec(stmt.order_by(Listing.created_at.desc())).all()
    return [ListingPublic(id=i.id, title=i.title, description=i.description, price=i.price, category=i.category.value, is_sold=i.is_sold, photo_url=i.photo_url, seller_id=i.seller_id) for i in items]

@router.post("", response_model=ListingPublic)
def create_listing(payload: ListingCreate, user: User = Depends(require_role(Role.seller)), session: Session = Depends(get_session)):
    listing = Listing(**payload.model_dump(), seller_id=user.id, category=Category(payload.category))
    session.add(listing); session.commit(); session.refresh(listing)
    return ListingPublic(id=listing.id, title=listing.title, description=listing.description, price=listing.price, category=listing.category.value, is_sold=listing.is_sold, photo_url=listing.photo_url, seller_id=listing.seller_id)

@router.patch("/{listing_id}", response_model=ListingPublic)
def update_listing(listing_id: int, payload: ListingUpdate, user: User = Depends(require_role(Role.seller)), session: Session = Depends(get_session)):
    listing = session.get(Listing, listing_id)
    if not listing: raise HTTPException(404, "Listing not found")
    if listing.seller_id != user.id and user.role != Role.admin:
        raise HTTPException(403, "Not your listing")
    data = payload.model_dump(exclude_unset=True)
    if "category" in data and data["category"]:
        data["category"] = Category(data["category"])
    for k,v in data.items(): setattr(listing, k, v)
    session.add(listing); session.commit(); session.refresh(listing)
    return ListingPublic(id=listing.id, title=listing.title, description=listing.description, price=listing.price, category=listing.category.value, is_sold=listing.is_sold, photo_url=listing.photo_url, seller_id=listing.seller_id)

@router.patch("/{listing_id}/sold", response_model=dict)
def mark_sold(listing_id: int, user: User = Depends(require_role(Role.seller)), session: Session = Depends(get_session)):
    listing = session.get(Listing, listing_id)
    if not listing: raise HTTPException(404, "Listing not found")
    if listing.seller_id != user.id and user.role != Role.admin:
        raise HTTPException(403, "Not your listing")
    listing.is_sold = True
    session.add(listing); session.commit()
    return {"ok": True}

@router.post("/upload", response_model=dict)
def upload_photo(file: UploadFile = File(...), user: User = Depends(get_current_user)):
    # very light validation
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".jpg",".jpeg",".png",".gif"]:
        raise HTTPException(400, "Unsupported file type")
    fname = f"{uuid.uuid4().hex}{ext}"
    path = os.path.join(settings.MEDIA_DIR, fname)
    with open(path, "wb") as out:
        shutil.copyfileobj(file.file, out)
    return {"photo_url": f"/media/{fname}"}

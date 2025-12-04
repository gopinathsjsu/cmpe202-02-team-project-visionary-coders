<<<<<<< HEAD
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from sqlalchemy import func
from sqlmodel import Session, select
from app.deps import require_role
from app.models.user import Role, User
from app.models.report import Report
from app.models.listing import Listing, ListingStatus
from app.schemas.report import ReportPublic
from app.schemas.user import UserPublic
from app.schemas.listing import ListingPublic
from app.schemas.admin import AdminSummary, ListingStatusUpdate

router = APIRouter()


def _scalar_count(session: Session, stmt):
    result = session.exec(stmt).one()
    if isinstance(result, tuple):
        return result[0] or 0
    return result or 0


def _to_listing_public(listing: Listing) -> ListingPublic:
    return ListingPublic(
        id=listing.id,
        title=listing.title,
        description=listing.description,
        price=listing.price,
        category=listing.category.value,
        status=listing.status.value,
        is_sold=listing.is_sold,
        photo_url=listing.photo_url,
        seller_id=listing.seller_id,
        created_at=listing.created_at,
    )


@router.get("/summary", response_model=AdminSummary)
def get_summary(session: Session = Depends(__import__("app.db.session", fromlist=["get_session"]).get_session), user=Depends(require_role(Role.admin))):
    total_users = _scalar_count(session, select(func.count()).select_from(User))
    total_sellers = _scalar_count(session, select(func.count()).select_from(User).where(User.role == Role.seller))
    total_admins = _scalar_count(session, select(func.count()).select_from(User).where(User.role == Role.admin))
    total_listings = _scalar_count(session, select(func.count()).select_from(Listing))
    pending_listings = _scalar_count(session, select(func.count()).select_from(Listing).where(Listing.status == ListingStatus.pending))
    approved_listings = _scalar_count(session, select(func.count()).select_from(Listing).where(Listing.status == ListingStatus.approved))
    rejected_listings = _scalar_count(session, select(func.count()).select_from(Listing).where(Listing.status == ListingStatus.rejected))
    sold_items = _scalar_count(session, select(func.count()).select_from(Listing).where(Listing.is_sold == True))

    return AdminSummary(
        total_users=total_users,
        total_sellers=total_sellers,
        total_admins=total_admins,
        total_listings=total_listings,
        pending_listings=pending_listings,
        approved_listings=approved_listings,
        rejected_listings=rejected_listings,
        sold_items=sold_items,
        generated_at=datetime.utcnow(),
    )


@router.get("/listings", response_model=List[ListingPublic])
def list_all_listings(status: Optional[str] = None, seller_id: Optional[int] = None, q: Optional[str] = None, session: Session = Depends(__import__("app.db.session", fromlist=["get_session"]).get_session), user=Depends(require_role(Role.admin))):
    stmt = select(Listing)
    if status:
        if status not in [s.value for s in ListingStatus]:
            raise HTTPException(400, "Invalid status filter")
        stmt = stmt.where(Listing.status == ListingStatus(status))
    if seller_id is not None:
        stmt = stmt.where(Listing.seller_id == seller_id)
    if q:
        like = f"%{q.lower()}%"
        stmt = stmt.where((Listing.title.ilike(like)) | (Listing.description.ilike(like)))
    listings = session.exec(stmt.order_by(Listing.created_at.desc())).all()
    return [_to_listing_public(l) for l in listings]


@router.patch("/listings/{listing_id}", response_model=ListingPublic)
def update_listing_status(listing_id: int, payload: ListingStatusUpdate, session: Session = Depends(__import__("app.db.session", fromlist=["get_session"]).get_session), user=Depends(require_role(Role.admin))):
    listing = session.get(Listing, listing_id)
    if not listing:
        raise HTTPException(404, "Listing not found")
    data = payload.model_dump(exclude_unset=True)
    if "status" in data and data["status"]:
        listing.status = ListingStatus(data["status"])
    if "is_sold" in data and data["is_sold"] is not None:
        listing.is_sold = data["is_sold"]
    session.add(listing)
    session.commit()
    session.refresh(listing)
    return _to_listing_public(listing)


@router.delete("/listings/{listing_id}", response_model=dict)
def delete_listing(listing_id: int, session: Session = Depends(__import__("app.db.session", fromlist=["get_session"]).get_session), user=Depends(require_role(Role.admin))):
    listing = session.get(Listing, listing_id)
    if not listing:
        raise HTTPException(404, "Listing not found")
    session.delete(listing)
    session.commit()
    return {"ok": True}


=======
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlmodel import Session, select
from app.deps import require_role
from app.models.user import Role
from app.models.report import Report
from app.schemas.report import ReportPublic

router = APIRouter()

>>>>>>> origin/main
@router.get("/reports", response_model=List[ReportPublic])
def list_reports(session: Session = Depends(__import__("app.db.session", fromlist=["get_session"]).get_session), user=Depends(require_role(Role.admin))):
    reports = session.exec(select(Report).order_by(Report.created_at.desc())).all()
    return [ReportPublic(id=r.id, listing_id=r.listing_id, reporter_id=r.reporter_id, reason=r.reason, resolved=r.resolved) for r in reports]

@router.patch("/reports/{report_id}/resolve", response_model=dict)
def resolve_report(report_id: int, session: Session = Depends(__import__("app.db.session", fromlist=["get_session"]).get_session), user=Depends(require_role(Role.admin))):
    rep = session.get(Report, report_id)
    if not rep: raise HTTPException(404, "Report not found")
    rep.resolved = True
    session.add(rep); session.commit()
    return {"ok": True}
<<<<<<< HEAD

@router.get("/users", response_model=List[UserPublic])
def list_users(session: Session = Depends(__import__("app.db.session", fromlist=["get_session"]).get_session), user=Depends(require_role(Role.admin))):
    users = session.exec(select(User)).all()
    return users

@router.delete("/users/{user_id}", response_model=dict)
def delete_user(user_id: int, session: Session = Depends(__import__("app.db.session", fromlist=["get_session"]).get_session), user=Depends(require_role(Role.admin))):
    user_to_delete = session.get(User, user_id)
    if not user_to_delete:
        raise HTTPException(404, "User not found")
    session.delete(user_to_delete)
    session.commit()
    return {"ok": True}

@router.get("/listings/pending", response_model=List[ListingPublic])
def list_pending_listings(session: Session = Depends(__import__("app.db.session", fromlist=["get_session"]).get_session), user=Depends(require_role(Role.admin))):
    listings = session.exec(select(Listing).where(Listing.status == ListingStatus.pending).order_by(Listing.created_at.desc())).all()
    return [_to_listing_public(l) for l in listings]

@router.patch("/listings/{listing_id}/approve", response_model=dict)
def approve_listing(listing_id: int, session: Session = Depends(__import__("app.db.session", fromlist=["get_session"]).get_session), user=Depends(require_role(Role.admin))):
    listing = session.get(Listing, listing_id)
    if not listing: raise HTTPException(404, "Listing not found")
    listing.status = ListingStatus.approved
    session.add(listing); session.commit()
    return {"ok": True}

@router.patch("/listings/{listing_id}/reject", response_model=dict)
def reject_listing(listing_id: int, session: Session = Depends(__import__("app.db.session", fromlist=["get_session"]).get_session), user=Depends(require_role(Role.admin))):
    listing = session.get(Listing, listing_id)
    if not listing: raise HTTPException(404, "Listing not found")
    listing.status = ListingStatus.rejected
    session.add(listing); session.commit()
    return {"ok": True}
=======
>>>>>>> origin/main

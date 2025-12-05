from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app.db.session import get_session
from app.deps import get_current_user
from app.models.user import User
from app.models.report import Report
from app.schemas.report import ReportCreate, ReportPublic

router = APIRouter()

@router.post("", response_model=ReportPublic)
def create_report(payload: ReportCreate, session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    report = Report(
        listing_id=payload.listing_id,
        reporter_id=user.id,
        reason=payload.reason
    )
    session.add(report)
    session.commit()
    session.refresh(report)
    return report

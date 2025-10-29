from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlmodel import Session, select
from app.deps import require_role
from app.models.user import Role
from app.models.report import Report
from app.schemas.report import ReportPublic

router = APIRouter()

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

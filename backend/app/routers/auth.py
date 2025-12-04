from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.db.session import get_session
from app.models.user import User, Role
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.config import settings
from app.schemas.auth import LoginRequest, RegisterRequest, Token

router = APIRouter()

@router.post("/register", response_model=dict)
def register(payload: RegisterRequest, session: Session = Depends(get_session)):
    if payload.role not in [r.value for r in Role]:
        raise HTTPException(400, "Invalid role")
    if session.exec(select(User).where(User.email == payload.email)).first():
        raise HTTPException(400, "Email already registered")
    user = User(email=payload.email, name=payload.name, role=Role(payload.role), hashed_password=get_password_hash(payload.password))
    session.add(user); session.commit(); session.refresh(user)
    return {"id": user.id, "email": user.email}

@router.post("/login", response_model=Token)
def login(payload: LoginRequest, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == payload.email)).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token(subject=user.email, secret_key=settings.SECRET_KEY, expires_minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return Token(access_token=token)

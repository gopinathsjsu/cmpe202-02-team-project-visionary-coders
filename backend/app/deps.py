from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.core.config import settings
from app.core.security import decode_token
from app.models.user import User, Role
from app.db.session import get_session
from sqlmodel import Session, select

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)) -> User:
    email = decode_token(token, settings.SECRET_KEY)
    user = session.exec(select(User).where(User.email == email)).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

def require_role(role: Role):
    def wrapper(user: User = Depends(get_current_user)):
        if user.role != role and user.role != Role.admin:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return user
    return wrapper

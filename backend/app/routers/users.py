from fastapi import APIRouter, Depends
from app.deps import get_current_user
from app.schemas.user import UserPublic
from app.models.user import User

router = APIRouter()

@router.get("/me", response_model=UserPublic)
def me(user: User = Depends(get_current_user)):
    return UserPublic(id=user.id, email=user.email, name=user.name, role=user.role.value)

from fastapi import APIRouter, Depends, HTTPException
from app.deps import get_current_user
from app.schemas.user import UserPublic, UserUpdate
from app.models.user import User
from app.db.session import get_session
from sqlalchemy.orm import Session
from app.core.security import get_password_hash, verify_password

router = APIRouter()

@router.get("/me", response_model=UserPublic)
def me(user: User = Depends(get_current_user)):
    return UserPublic(id=user.id, email=user.email, name=user.name, role=user.role)

@router.put("/me", response_model=UserPublic)
def update_me(user_update: UserUpdate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    """Update current user's profile"""
    user = current_user
    
    # Update name if provided
    if user_update.name is not None:
        user.name = user_update.name
    
    # Update email if provided (check for uniqueness)
    if user_update.email is not None:
        # Check if email already exists
        existing_user = session.query(User).filter(User.email == user_update.email, User.id != user.id).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already in use")
        user.email = user_update.email
    
    # Update password if provided
    if user_update.password is not None:
        # If new password is provided, verify current password for security
        if user_update.currentPassword is None:
            raise HTTPException(status_code=400, detail="Current password is required to change password")
        if not verify_password(user_update.currentPassword, user.hashed_password):
            raise HTTPException(status_code=400, detail="Current password is incorrect")
        user.hashed_password = get_password_hash(user_update.password)
    
    # Update roles if provided (can be multiple: "buyer,seller" or single)
    if user_update.roles is not None:
        # Validate roles
        roles_list = [r.strip().lower() for r in user_update.roles.split(',')]
        valid_roles = ['buyer', 'seller']
        for role in roles_list:
            if role not in valid_roles:
                raise HTTPException(status_code=400, detail=f"Invalid role: {role}")
        # Store as comma-separated string
        user.role = ','.join(roles_list)
    
    session.add(user)
    session.commit()
    session.refresh(user)
    
    return UserPublic(id=user.id, email=user.email, name=user.name, role=user.role)

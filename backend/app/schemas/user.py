from pydantic import BaseModel, EmailStr
from typing import Optional

class UserPublic(BaseModel):
    id: int
    email: EmailStr
    name: str
    role: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    currentPassword: Optional[str] = None  # For password change verification
    roles: Optional[str] = None  # Comma-separated roles: "buyer,seller"

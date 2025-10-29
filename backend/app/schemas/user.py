from pydantic import BaseModel, EmailStr

class UserPublic(BaseModel):
    id: int
    email: EmailStr
    name: str
    role: str

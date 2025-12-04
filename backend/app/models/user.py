from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from enum import Enum

class Role(str, Enum):
    buyer = "buyer"
    seller = "seller"
    admin = "admin"

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    name: str
    role: Role
    hashed_password: str
    # relationships
    listings: List["Listing"] = Relationship(back_populates="seller")

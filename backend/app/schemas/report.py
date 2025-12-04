from pydantic import BaseModel, Field

class ReportCreate(BaseModel):
    listing_id: int
    reason: str = Field(min_length=3)

class ReportPublic(BaseModel):
    id: int
    listing_id: int
    reporter_id: int
    reason: str
    resolved: bool

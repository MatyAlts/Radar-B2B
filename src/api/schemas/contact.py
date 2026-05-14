from pydantic import BaseModel
from typing import Optional


class ContactCreate(BaseModel):
    name: str
    title: Optional[str] = None
    email: Optional[str] = None
    linkedin_url: Optional[str] = None
    phone: Optional[str] = None
    confidence_score: float = 0.8


class ContactResponse(BaseModel):
    id: str
    name: str
    title: Optional[str] = None
    email: Optional[str] = None
    linkedin_url: Optional[str] = None
    phone: Optional[str] = None
    confidence_score: float

    class Config:
        from_attributes = True

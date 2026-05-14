from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CompanyCreate(BaseModel):
    name: str
    industry: Optional[str] = None
    location: Optional[str] = None
    employee_count: Optional[int] = None
    website: Optional[str] = None


class CompanyResponse(BaseModel):
    id: str
    name: str
    industry: Optional[str] = None
    location: Optional[str] = None
    employee_count: Optional[int] = None
    website: Optional[str] = None
    score: int
    temperature: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class CompanyListResponse(BaseModel):
    items: list[CompanyResponse]
    total: int
    page: int
    limit: int

from pydantic import BaseModel
from datetime import datetime


class SignalCreate(BaseModel):
    signal_type: str
    source: str
    description: str
    relevance: float = 0.5


class SignalResponse(BaseModel):
    id: str
    signal_type: str
    source: str
    description: str
    relevance: float
    detected_at: datetime

    class Config:
        from_attributes = True

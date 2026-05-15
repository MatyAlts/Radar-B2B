from pydantic import BaseModel, model_validator
from typing import Optional
from datetime import datetime


class CompanyCreate(BaseModel):
    name: str
    industry: Optional[str] = None
    location: Optional[str] = None
    employee_count: Optional[int] = None
    website: Optional[str] = None


class SignalResponse(BaseModel):
    id: str
    type: str
    name: str
    description: str
    active: bool
    points: int

class CompanySignalsResponse(BaseModel):
    signals: list[SignalResponse]
    total_points: int

class ContactResponse(BaseModel):
    id: str
    name: str
    title: str
    email: Optional[str] = None
    phone: Optional[str] = None

class TenderResponse(BaseModel):
    id: str
    title: str
    description: str
    date: str
    status: str

class CompanyResponse(BaseModel):
    id: str
    name: str
    industry: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = "Bolivia"
    score: int
    temperature: str
    signals: Optional[CompanySignalsResponse] = None
    contacts: list[ContactResponse] = []
    tenders: list[TenderResponse] = []
    score_justification: Optional[str] = None
    last_updated: Optional[datetime] = None

    @model_validator(mode='before')
    @classmethod
    def wrap_signals(cls, data: any) -> any:
        # Si ya es un dict (p.ej. desde la DB o mock), lo dejamos pasar
        if isinstance(data, dict):
            if 'signals' in data and isinstance(data['signals'], list):
                if not isinstance(data.get('signals_data'), dict):
                    data['signals'] = {
                        "signals": data['signals'],
                        "total_points": sum(s.get('points', 0) for s in data['signals'] if isinstance(s, dict))
                    }
            return data
            
        # Si es un objeto (entity)
        signals_raw = getattr(data, 'signals', [])
        if not isinstance(signals_raw, list):
            signals_raw = []
            
        # Creamos el objeto CompanySignalsResponse
        wrapped_signals = CompanySignalsResponse(
            signals=signals_raw,
            total_points=sum(getattr(s, 'points', 0) for s in signals_raw if hasattr(s, 'points'))
        )
        
        # Como no podemos modificar la entidad directamente si es dataclass (a veces)
        # creamos un diccionario con los datos para Pydantic
        result = {
            "id": data.id,
            "name": data.name,
            "industry": getattr(data, 'industry', None),
            "city": getattr(data, 'city', None),
            "country": getattr(data, 'country', 'Bolivia'),
            "score": getattr(data, 'score', 0),
            "temperature": getattr(data, 'temperature', 'frío'),
            "signals": wrapped_signals,
            "contacts": getattr(data, 'contacts', []),
            "tenders": getattr(data, 'tenders', []),
            "score_justification": getattr(data, 'score_justification', None),
            "last_updated": getattr(data, 'last_updated', None) or getattr(data, 'created_at', None)
        }
        return result

    class Config:
        from_attributes = True


class CompanyListResponse(BaseModel):
    data: list[CompanyResponse]
    total: int
    page: int
    page_size: int
    total_pages: int

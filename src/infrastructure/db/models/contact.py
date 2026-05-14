from sqlalchemy import Column, String, Float, DateTime, ForeignKey, func
from src.infrastructure.db.base import Base


class ContactModel(Base):
    """Modelo SQLAlchemy para contactos."""

    __tablename__ = "contacts"

    id = Column(String(36), primary_key=True)
    company_id = Column(String(36), ForeignKey("companies.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    title = Column(String(255))
    email = Column(String(255), index=True)
    linkedin_url = Column(String(255))
    phone = Column(String(20))
    apollo_id = Column(String(100))

    # Confiabilidad
    confidence_score = Column(Float, default=0.0)

    # Metadata
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

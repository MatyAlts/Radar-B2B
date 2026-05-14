from sqlalchemy import Column, String, Float, DateTime, func
from src.infrastructure.db.base import Base


class TenderModel(Base):
    """Modelo SQLAlchemy para licitaciones."""

    __tablename__ = "tenders"

    id = Column(String(36), primary_key=True)
    process_number = Column(String(100), nullable=False, unique=True, index=True)
    entity_name = Column(String(255), nullable=False, index=True)
    description = Column(String(1000))
    amount = Column(Float)
    status = Column(String(50), default="active")  # active, closed, awarded, cancelled
    source = Column(String(50), default="sicoes")

    # Fechas
    published_date = Column(DateTime)
    closing_date = Column(DateTime)

    # Metadata
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

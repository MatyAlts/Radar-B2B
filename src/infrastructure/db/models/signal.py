from sqlalchemy import Column, String, Float, DateTime, ForeignKey, func
from src.infrastructure.db.base import Base


class SignalModel(Base):
    """Modelo SQLAlchemy para señales de compra."""

    __tablename__ = "signals"

    id = Column(String(36), primary_key=True)
    company_id = Column(String(36), ForeignKey("companies.id"), nullable=False, index=True)
    signal_type = Column(String(100), nullable=False)  # news, tender, growth, etc.
    source = Column(String(100), nullable=False)  # sicoes, news_scraping, apollo, manual
    description = Column(String(1000), nullable=False)
    relevance = Column(Float, default=0.5)  # 0.0 - 1.0
    detected_at = Column(DateTime, default=func.now())

    # Metadata
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

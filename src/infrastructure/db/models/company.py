from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, func
from src.infrastructure.db.base import Base


class CompanyModel(Base):
    """Modelo SQLAlchemy para empresas."""

    __tablename__ = "companies"

    id = Column(String(36), primary_key=True)
    name = Column(String(255), nullable=False, index=True)
    industry = Column(String(100))
    city = Column(String(100))
    country = Column(String(100), default="Bolivia")
    employee_count = Column(Integer)
    website = Column(String(255))
    apollo_id = Column(String(100), unique=True)

    # Señales booleanas
    strategic_sector = Column(Boolean, default=False)
    recent_growth = Column(Boolean, default=False)
    sicoes_participation = Column(Boolean, default=False)
    adequate_size = Column(Boolean, default=False)
    decision_maker_found = Column(Boolean, default=False)
    purchase_signal = Column(Boolean, default=False)

    # Score
    score = Column(Integer, default=0)
    temperature = Column(String(20), default="frío")  # caliente, tibio, frío
    score_justification = Column(Text)

    # Metadata
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    last_enriched_at = Column(DateTime)

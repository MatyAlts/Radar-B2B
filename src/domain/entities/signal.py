from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class CompanySignal:
    """Entidad CompanySignal (señal de compra)."""

    id: Optional[str] = None
    company_id: str = ""
    signal_type: str = ""  # news, tender, growth, etc.
    source: str = ""  # sicoes, news_scraping, apollo, manual
    description: str = ""
    relevance: float = 0.5  # 0.0 - 1.0
    detected_at: datetime = None

    # Metadata
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    def __post_init__(self):
        if self.detected_at is None:
            self.detected_at = datetime.utcnow()

    def is_high_relevance(self) -> bool:
        """Retorna True si la relevancia es alta (> 0.7)."""
        return self.relevance > 0.7

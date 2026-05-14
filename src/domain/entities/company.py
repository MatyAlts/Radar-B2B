from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class Company:
    """Entidad Company con señales booleanas y scoring."""

    id: Optional[str] = None
    name: str = ""
    industry: Optional[str] = None
    location: Optional[str] = None
    employee_count: Optional[int] = None
    website: Optional[str] = None
    apollo_id: Optional[str] = None

    # Señales booleanas para el scoring
    strategic_sector: bool = False
    recent_growth: bool = False
    sicoes_participation: bool = False
    adequate_size: bool = False
    decision_maker_found: bool = False
    purchase_signal: bool = False

    # Resultado del scoring
    score: int = 0
    temperature: str = "cold"  # cold, warm, hot
    score_justification: Optional[str] = None

    # Metadata
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    last_enriched_at: Optional[datetime] = None

    def has_all_signals(self) -> bool:
        """Retorna True si todos los signals están presentes."""
        return all(
            [
                self.strategic_sector,
                self.recent_growth,
                self.sicoes_participation,
                self.adequate_size,
                self.decision_maker_found,
                self.purchase_signal,
            ]
        )

    def signal_count(self) -> int:
        """Cuenta cuántos signals están presentes."""
        return sum(
            [
                self.strategic_sector,
                self.recent_growth,
                self.sicoes_participation,
                self.adequate_size,
                self.decision_maker_found,
                self.purchase_signal,
            ]
        )

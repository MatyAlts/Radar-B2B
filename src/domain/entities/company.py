from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional


@dataclass
class Company:
    """Entidad Company con señales booleanas y scoring."""

    id: Optional[str] = None
    name: str = ""
    industry: Optional[str] = None
    city: Optional[str] = None
    country: str = "Bolivia"
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
    temperature: str = "frío"  # caliente, tibio, frío
    score_justification: Optional[str] = None

    # Metadata
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    last_updated: Optional[datetime] = None
    last_enriched_at: Optional[datetime] = None

    # Relaciones
    contacts: list = field(default_factory=list)
    signals: list = field(default_factory=list)
    tenders: list = field(default_factory=list)

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

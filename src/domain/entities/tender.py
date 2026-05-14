from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class Tender:
    """Entidad Tender (proceso de licitación)."""

    id: Optional[str] = None
    process_number: str = ""
    entity_name: str = ""
    description: str = ""
    amount: Optional[float] = None
    status: str = "active"  # active, closed, awarded, cancelled
    source: str = "sicoes"

    # Fechas
    published_date: Optional[datetime] = None
    closing_date: Optional[datetime] = None

    # Metadata
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    def is_active(self) -> bool:
        """Retorna True si la licitación está activa."""
        return self.status == "active"

    def is_large_tender(self, threshold: float = 50000.0) -> bool:
        """Retorna True si el monto es significativo."""
        return self.amount is not None and self.amount >= threshold

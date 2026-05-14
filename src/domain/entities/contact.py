from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class Contact:
    """Entidad Contact (decisor de compra)."""

    id: Optional[str] = None
    company_id: str = ""
    name: str = ""
    title: str = ""
    email: Optional[str] = None
    linkedin_url: Optional[str] = None
    phone: Optional[str] = None
    apollo_id: Optional[str] = None

    # Confiabilidad de los datos
    confidence_score: float = 0.0  # 0.0 - 1.0

    # Metadata
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    def is_decision_maker(self) -> bool:
        """Retorna True si el título sugiere que es un decisor de compra."""
        decision_titles = [
            "gerente",
            "director",
            "dueño",
            "owner",
            "jefe",
            "chief",
            "presidente",
            "vice",
            "gerenta",
        ]
        return any(title.lower() in self.title.lower() for title in decision_titles)

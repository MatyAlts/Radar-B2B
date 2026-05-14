from typing import List
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession

from src.domain.entities.signal import CompanySignal
from src.infrastructure.db.repositories.signal_repository import SignalRepository


class SignalService:
    """Servicio para gestionar señales de compra."""

    def __init__(self, session: AsyncSession):
        self.repo = SignalRepository(session)

    async def register_signal(
        self,
        company_id: str,
        signal_type: str,
        source: str,
        description: str,
        relevance: float = 0.5,
    ) -> CompanySignal:
        """Registra una nueva señal de compra."""
        signal = CompanySignal(
            company_id=company_id,
            signal_type=signal_type,
            source=source,
            description=description,
            relevance=relevance,
            detected_at=datetime.utcnow(),
        )

        return await self.repo.create(signal)

    async def get_company_signals(self, company_id: str) -> List[CompanySignal]:
        """Obtiene todas las señales de una empresa."""
        return await self.repo.list_by_company(company_id)

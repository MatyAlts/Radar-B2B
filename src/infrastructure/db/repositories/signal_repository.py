import uuid
from typing import List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.domain.entities.signal import CompanySignal
from src.domain.interfaces.repositories import SignalRepository as ISignalRepository
from src.infrastructure.db.models.signal import SignalModel


class SignalRepository(ISignalRepository):
    """Implementación concreta del repositorio de señales."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, signal: CompanySignal) -> CompanySignal:
        if not signal.id:
            signal.id = str(uuid.uuid4())

        model = SignalModel(
            id=signal.id,
            company_id=signal.company_id,
            signal_type=signal.signal_type,
            source=signal.source,
            description=signal.description,
            relevance=signal.relevance,
            detected_at=signal.detected_at,
        )
        self.session.add(model)
        await self.session.flush()
        return self._model_to_entity(model)

    async def list_by_company(self, company_id: str) -> List[CompanySignal]:
        stmt = select(SignalModel).where(SignalModel.company_id == company_id)
        result = await self.session.execute(stmt)
        models = result.scalars().all()
        return [self._model_to_entity(model) for model in models]

    @staticmethod
    def _model_to_entity(model: SignalModel) -> CompanySignal:
        return CompanySignal(
            id=model.id,
            company_id=model.company_id,
            signal_type=model.signal_type,
            source=model.source,
            description=model.description,
            relevance=model.relevance,
            detected_at=model.detected_at,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

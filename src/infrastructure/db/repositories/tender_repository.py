import uuid
from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.domain.entities.tender import Tender
from src.domain.interfaces.repositories import TenderRepository as ITenderRepository
from src.infrastructure.db.models.tender import TenderModel


class TenderRepository(ITenderRepository):
    """Implementación concreta del repositorio de licitaciones."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, tender_id: str) -> Optional[Tender]:
        stmt = select(TenderModel).where(TenderModel.id == tender_id)
        result = await self.session.execute(stmt)
        model = result.scalar_one_or_none()
        return self._model_to_entity(model) if model else None

    async def create(self, tender: Tender) -> Tender:
        if not tender.id:
            tender.id = str(uuid.uuid4())

        model = TenderModel(
            id=tender.id,
            process_number=tender.process_number,
            entity_name=tender.entity_name,
            description=tender.description,
            amount=tender.amount,
            status=tender.status,
            source=tender.source,
            published_date=tender.published_date,
            closing_date=tender.closing_date,
        )
        self.session.add(model)
        await self.session.flush()
        return self._model_to_entity(model)

    async def upsert(self, tender: Tender) -> Tender:
        stmt = select(TenderModel).where(
            TenderModel.process_number == tender.process_number
        )
        result = await self.session.execute(stmt)
        model = result.scalar_one_or_none()

        if model:
            model.entity_name = tender.entity_name
            model.description = tender.description
            model.amount = tender.amount
            model.status = tender.status
            model.source = tender.source
            model.published_date = tender.published_date
            model.closing_date = tender.closing_date
            await self.session.flush()
            return self._model_to_entity(model)

        return await self.create(tender)

    async def list_active(self, limit: int = 100) -> List[Tender]:
        stmt = (
            select(TenderModel)
            .where(TenderModel.status == "active")
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        models = result.scalars().all()
        return [self._model_to_entity(model) for model in models]

    async def list_by_company(self, company_id: str) -> List[Tender]:
        # Este método requeriría una tabla de asociación entre empresas y licitaciones
        # Por ahora retorna una lista vacía
        return []

    @staticmethod
    def _model_to_entity(model: TenderModel) -> Tender:
        return Tender(
            id=model.id,
            process_number=model.process_number,
            entity_name=model.entity_name,
            description=model.description,
            amount=model.amount,
            status=model.status,
            source=model.source,
            published_date=model.published_date,
            closing_date=model.closing_date,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

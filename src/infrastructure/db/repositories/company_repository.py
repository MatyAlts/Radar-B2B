import uuid
from typing import List, Optional
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from src.domain.entities.company import Company
from src.domain.interfaces.repositories import CompanyRepository as ICompanyRepository
from src.infrastructure.db.models.company import CompanyModel


class CompanyRepository(ICompanyRepository):
    """Implementación concreta del repositorio de empresas."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, company_id: str) -> Optional[Company]:
        stmt = select(CompanyModel).where(CompanyModel.id == company_id)
        result = await self.session.execute(stmt)
        model = result.scalar_one_or_none()
        return self._model_to_entity(model) if model else None

    async def create(self, company: Company) -> Company:
        if not company.id:
            company.id = str(uuid.uuid4())

        model = CompanyModel(
            id=company.id,
            name=company.name,
            industry=company.industry,
            location=company.location,
            employee_count=company.employee_count,
            website=company.website,
            apollo_id=company.apollo_id,
            strategic_sector=company.strategic_sector,
            recent_growth=company.recent_growth,
            sicoes_participation=company.sicoes_participation,
            adequate_size=company.adequate_size,
            decision_maker_found=company.decision_maker_found,
            purchase_signal=company.purchase_signal,
            score=company.score,
            temperature=company.temperature,
            score_justification=company.score_justification,
        )
        self.session.add(model)
        await self.session.flush()
        return self._model_to_entity(model)

    async def update(self, company: Company) -> Company:
        stmt = select(CompanyModel).where(CompanyModel.id == company.id)
        result = await self.session.execute(stmt)
        model = result.scalar_one()

        model.name = company.name
        model.industry = company.industry
        model.location = company.location
        model.employee_count = company.employee_count
        model.website = company.website
        model.apollo_id = company.apollo_id
        model.strategic_sector = company.strategic_sector
        model.recent_growth = company.recent_growth
        model.sicoes_participation = company.sicoes_participation
        model.adequate_size = company.adequate_size
        model.decision_maker_found = company.decision_maker_found
        model.purchase_signal = company.purchase_signal
        model.score = company.score
        model.temperature = company.temperature
        model.score_justification = company.score_justification

        await self.session.flush()
        return self._model_to_entity(model)

    async def list(
        self, skip: int = 0, limit: int = 10, industry: Optional[str] = None
    ) -> tuple[List[Company], int]:
        query = select(CompanyModel)
        if industry:
            query = query.where(CompanyModel.industry == industry)

        count_stmt = select(func.count()).select_from(CompanyModel)
        if industry:
            count_stmt = count_stmt.where(CompanyModel.industry == industry)

        count_result = await self.session.execute(count_stmt)
        total = count_result.scalar()

        query = query.offset(skip).limit(limit)
        result = await self.session.execute(query)
        models = result.scalars().all()

        companies = [self._model_to_entity(model) for model in models]
        return companies, total

    async def delete(self, company_id: str) -> bool:
        stmt = select(CompanyModel).where(CompanyModel.id == company_id)
        result = await self.session.execute(stmt)
        model = result.scalar_one_or_none()

        if model:
            await self.session.delete(model)
            await self.session.flush()
            return True
        return False

    @staticmethod
    def _model_to_entity(model: CompanyModel) -> Company:
        return Company(
            id=model.id,
            name=model.name,
            industry=model.industry,
            location=model.location,
            employee_count=model.employee_count,
            website=model.website,
            apollo_id=model.apollo_id,
            strategic_sector=model.strategic_sector,
            recent_growth=model.recent_growth,
            sicoes_participation=model.sicoes_participation,
            adequate_size=model.adequate_size,
            decision_maker_found=model.decision_maker_found,
            purchase_signal=model.purchase_signal,
            score=model.score,
            temperature=model.temperature,
            score_justification=model.score_justification,
            created_at=model.created_at,
            updated_at=model.updated_at,
            last_enriched_at=model.last_enriched_at,
        )

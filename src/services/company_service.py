from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession

from src.domain.entities.company import Company
from src.domain.scoring import CompanySignals, calculate_score, determine_temperature
from src.infrastructure.db.repositories.company_repository import CompanyRepository
from src.infrastructure.apollo.client import ApolloClient


class CompanyService:
    """Servicio para gestionar empresas."""

    def __init__(self, session: AsyncSession, apollo_client: ApolloClient):
        self.repo = CompanyRepository(session)
        self.apollo_client = apollo_client

    async def search_companies(
        self,
        industry: Optional[str] = None,
        location: Optional[str] = None,
        skip: int = 0,
        limit: int = 10,
    ) -> tuple[List[Company], int]:
        """Busca empresas con filtros."""
        return await self.repo.list(skip=skip, limit=limit, industry=industry)

    async def enrich_company(self, name: str, domain: Optional[str] = None) -> Optional[Company]:
        """Enriquece datos de una empresa desde Apollo.io."""
        apollo_data = await self.apollo_client.enrich_organization(name, domain)

        if not apollo_data:
            return None

        company = Company(
            name=apollo_data.get("name", name),
            website=apollo_data.get("website_url"),
            apollo_id=apollo_data.get("id"),
            employee_count=apollo_data.get("employee_count"),
        )

        return await self.repo.create(company)

    async def get_company_score(self, company_id: str) -> Optional[Company]:
        """Obtiene una empresa con su score."""
        return await self.repo.get_by_id(company_id)

    async def recalculate_score(self, company: Company) -> Company:
        """Recalcula el score de una empresa."""
        signals = CompanySignals(
            strategic_sector=company.strategic_sector,
            recent_growth=company.recent_growth,
            sicoes_participation=company.sicoes_participation,
            adequate_size=company.adequate_size,
            decision_maker_found=company.decision_maker_found,
            purchase_signal=company.purchase_signal,
        )

        company.score = calculate_score(signals)
        company.temperature = determine_temperature(company.score)

        return await self.repo.update(company)

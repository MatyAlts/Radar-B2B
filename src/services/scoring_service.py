from sqlalchemy.ext.asyncio import AsyncSession

from src.domain.entities.company import Company
from src.domain.scoring import determine_temperature
from src.infrastructure.db.repositories.company_repository import CompanyRepository


class ScoringService:
    """Servicio para gestionar scoring de empresas."""

    def __init__(self, session: AsyncSession):
        self.repo = CompanyRepository(session)

    async def recalculate_score(self, company: Company) -> Company:
        """Recalcula el score de una empresa."""
        # El score se calcula automáticamente basado en las señales
        # En una versión futura, aquí se llamaría a Claude API para generar justificación

        company.temperature = determine_temperature(company.score)
        return await self.repo.update(company)

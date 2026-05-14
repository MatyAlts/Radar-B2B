from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.config import get_settings
from src.infrastructure.db.session import get_session
from src.infrastructure.apollo.client import ApolloClient
from src.services.company_service import CompanyService
from src.api.schemas.company import CompanyCreate, CompanyResponse, CompanyListResponse

settings = get_settings()
router = APIRouter(prefix="/companies", tags=["companies"])


@router.get("", response_model=CompanyListResponse)
async def list_companies(
    skip: int = 0,
    limit: int = 10,
    industry: str = None,
    session: AsyncSession = Depends(get_session),
):
    """Lista empresas con paginación."""
    apollo_client = ApolloClient(settings.apollo_api_key)
    service = CompanyService(session, apollo_client)
    companies, total = await service.search_companies(
        industry=industry, skip=skip, limit=limit
    )
    await apollo_client.close()

    return {
        "items": companies,
        "total": total,
        "page": skip // limit + 1,
        "limit": limit,
    }


@router.post("", response_model=CompanyResponse)
async def create_company(
    company: CompanyCreate,
    session: AsyncSession = Depends(get_session),
):
    """Crea una nueva empresa."""
    from src.domain.entities.company import Company as CompanyEntity

    db_company = CompanyEntity(name=company.name, industry=company.industry)

    apollo_client = ApolloClient(settings.apollo_api_key)
    service = CompanyService(session, apollo_client)
    # Here we would save to DB
    result = await service.repo.create(db_company)
    await apollo_client.close()

    return result


@router.get("/{company_id}", response_model=CompanyResponse)
async def get_company(
    company_id: str,
    session: AsyncSession = Depends(get_session),
):
    """Obtiene una empresa por ID."""
    apollo_client = ApolloClient(settings.apollo_api_key)
    service = CompanyService(session, apollo_client)
    company = await service.get_company_score(company_id)
    await apollo_client.close()

    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    return company


@router.post("/{company_id}/enrich", response_model=CompanyResponse)
async def enrich_company(
    company_id: str,
    name: str,
    domain: str = None,
    session: AsyncSession = Depends(get_session),
):
    """Enriquece datos de una empresa desde Apollo.io."""
    apollo_client = ApolloClient(settings.apollo_api_key)
    service = CompanyService(session, apollo_client)

    company = await service.get_company_score(company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    # Enrich from Apollo
    enriched = await service.enrich_company(name, domain)
    await apollo_client.close()

    if not enriched:
        raise HTTPException(status_code=400, detail="Failed to enrich company")

    return enriched

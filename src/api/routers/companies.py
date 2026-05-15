from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from src.config import get_settings
from src.infrastructure.db.session import get_session
from src.infrastructure.apollo.client import ApolloClient
from src.infrastructure.ai.gemini_client import GeminiClient
from src.services.company_service import CompanyService
from src.api.schemas.company import CompanyCreate, CompanyResponse, CompanyListResponse

settings = get_settings()
router = APIRouter(prefix="/companies", tags=["companies"])


def _make_service(session: AsyncSession) -> tuple[CompanyService, ApolloClient]:
    apollo = ApolloClient(settings.apollo_api_key)
    gemini = GeminiClient(settings.gemini_api_key) if settings.gemini_api_key else None
    return CompanyService(session, apollo, gemini), apollo


def page_to_skip(page: int, page_size: int) -> int:
    return (page - 1) * page_size


@router.get("", response_model=CompanyListResponse)
async def list_companies(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    industries: str = Query(None),
    temperature: str = Query(None),
    score_min: int = Query(None),
    score_max: int = Query(None),
    query: str = Query(None),
    session: AsyncSession = Depends(get_session),
):
    skip = page_to_skip(page, page_size)
    industry_list = industries.split(",") if industries else None

    service, apollo = _make_service(session)
    companies, total = await service.search_companies(
        industries=industry_list,
        temperature=temperature,
        score_min=score_min,
        score_max=score_max,
        query=query,
        skip=skip,
        limit=page_size,
    )
    await apollo.close()

    total_pages = (total + page_size - 1) // page_size if page_size > 0 else 1
    return {
        "data": companies,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
    }


@router.post("", response_model=CompanyResponse)
async def create_company(
    company: CompanyCreate,
    session: AsyncSession = Depends(get_session),
):
    from src.domain.entities.company import Company as CompanyEntity

    db_company = CompanyEntity(name=company.name, industry=company.industry)
    service, apollo = _make_service(session)
    result = await service.repo.create(db_company)
    await apollo.close()
    return result


@router.get("/{company_id}", response_model=CompanyResponse)
async def get_company(
    company_id: str,
    session: AsyncSession = Depends(get_session),
):
    service, apollo = _make_service(session)
    company = await service.get_company_score(company_id)
    await apollo.close()

    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company


@router.post("/{company_id}/enrich", response_model=CompanyResponse)
async def enrich_company(
    company_id: str,
    domain: str = Query(None),
    session: AsyncSession = Depends(get_session),
):
    service, apollo = _make_service(session)

    company = await service.get_company_score(company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    effective_domain = domain or company.website
    if not effective_domain:
        raise HTTPException(status_code=400, detail="No domain provided and company has no website")

    enriched = await service.enrich_company(company_id, effective_domain)
    await apollo.close()

    if not enriched:
        raise HTTPException(status_code=400, detail="Failed to enrich company")
    return enriched


@router.post("/{company_id}/score", response_model=CompanyResponse)
async def recalculate_company_score(
    company_id: str,
    session: AsyncSession = Depends(get_session),
):
    service, apollo = _make_service(session)

    company = await service.get_company_score(company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    updated = await service.recalculate_score(company)
    await apollo.close()
    return updated


@router.get("/{company_id}/contacts", response_model=list[dict])
async def get_company_contacts(
    company_id: str,
    session: AsyncSession = Depends(get_session),
):
    service, apollo = _make_service(session)
    contacts = await service.get_company_contacts(company_id)
    await apollo.close()
    return contacts


@router.delete("/{company_id}")
async def delete_company(
    company_id: str,
    session: AsyncSession = Depends(get_session),
):
    service, apollo = _make_service(session)
    success = await service.delete_company(company_id)
    await apollo.close()

    if not success:
        raise HTTPException(status_code=404, detail="Company not found")
    return {"status": "success"}


@router.post("/sync")
async def sync_companies(
    industries: list[str] = ["Mining", "Logistics", "Agriculture", "Industrial Engineering", "Warehousing"],
    locations: list[str] = ["Bolivia"],
    session: AsyncSession = Depends(get_session),
):
    service, apollo = _make_service(session)
    synced = await service.sync_from_apollo(industries, locations)
    await apollo.close()
    return {"status": "success", "synced_count": len(synced)}

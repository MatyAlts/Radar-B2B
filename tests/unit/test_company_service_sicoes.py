import pytest
from unittest.mock import AsyncMock, MagicMock, patch

from src.domain.entities.company import Company
from src.services.company_service import CompanyService


def _make_company(sicoes=False, score=0):
    c = MagicMock(spec=Company)
    c.id = "company-123"
    c.name = "ACSA Bolivia S.R.L."
    c.sicoes_participation = sicoes
    c.score = score
    c.temperature = "frio"
    c.score_justification = ""
    c.strategic_sector = False
    c.recent_growth = False
    c.adequate_size = False
    c.decision_maker_found = False
    c.purchase_signal = False
    return c


@pytest.fixture
def service():
    session = AsyncMock()
    apollo_client = AsyncMock()
    svc = CompanyService(session=session, apollo_client=apollo_client)
    svc.repo = AsyncMock()
    svc.gemini = None
    return svc


@pytest.mark.asyncio
async def test_enrich_sicoes_actualiza_flag_y_recalcula_score(service):
    company = _make_company(sicoes=False, score=10)
    service.repo.get_by_id.return_value = company
    service.repo.update.return_value = company

    with patch(
        "src.services.company_service.SicoesScraper"
    ) as MockScraper:
        mock_instance = AsyncMock()
        mock_instance.check_company_participation.return_value = True
        MockScraper.return_value = mock_instance

        result = await service.enrich_sicoes("company-123")

    assert company.sicoes_participation is True
    service.repo.update.assert_called_once()
    assert result is company


@pytest.mark.asyncio
async def test_enrich_sicoes_empresa_no_encontrada_deja_false(service):
    company = _make_company(sicoes=False, score=10)
    service.repo.get_by_id.return_value = company
    service.repo.update.return_value = company

    with patch(
        "src.services.company_service.SicoesScraper"
    ) as MockScraper:
        mock_instance = AsyncMock()
        mock_instance.check_company_participation.return_value = False
        MockScraper.return_value = mock_instance

        result = await service.enrich_sicoes("company-123")

    assert company.sicoes_participation is False
    service.repo.update.assert_called_once()


@pytest.mark.asyncio
async def test_enrich_sicoes_company_no_existe_retorna_none(service):
    service.repo.get_by_id.return_value = None

    result = await service.enrich_sicoes("nonexistent-id")

    assert result is None
    service.repo.update.assert_not_called()

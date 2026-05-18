import pytest
import httpx
from unittest.mock import AsyncMock, MagicMock, patch

from src.infrastructure.sicoes.scraper import SicoesScraper


MAIN_PAGE_HTML = """
<html><body>
<input id="token" type="hidden" name="token" value="abc123main">
</body></html>
"""

SEARCH_PAGE_HTML = """
<html><body>
<input type="hidden" name="token" value="abc123search">
<input type="text" name="empresa">
</body></html>
"""


def _make_response(status=200, text="", json_data=None):
    resp = MagicMock(spec=httpx.Response)
    resp.status_code = status
    resp.text = text
    if json_data is not None:
        resp.json = MagicMock(return_value=json_data)
    resp.raise_for_status = MagicMock()
    return resp


@pytest.fixture
def scraper():
    return SicoesScraper()


@pytest.mark.asyncio
async def test_empresa_encontrada_retorna_true(scraper):
    found_json = {"recordsTotal": 5, "recordsFiltered": 5, "data": [{"col": "val"}]}

    with patch("httpx.AsyncClient") as mock_client_cls:
        mock_client = AsyncMock()
        mock_client_cls.return_value.__aenter__.return_value = mock_client

        mock_client.get.side_effect = [
            _make_response(text=MAIN_PAGE_HTML),
            _make_response(text=SEARCH_PAGE_HTML),
        ]
        mock_client.post.return_value = _make_response(json_data=found_json)

        result = await scraper.check_company_participation("ACSA BOLIVIA S.R.L.")

    assert result is True


@pytest.mark.asyncio
async def test_empresa_no_encontrada_retorna_false(scraper):
    not_found_json = {"recordsTotal": 0, "recordsFiltered": 0, "data": []}

    with patch("httpx.AsyncClient") as mock_client_cls:
        mock_client = AsyncMock()
        mock_client_cls.return_value.__aenter__.return_value = mock_client

        mock_client.get.side_effect = [
            _make_response(text=MAIN_PAGE_HTML),
            _make_response(text=SEARCH_PAGE_HTML),
        ]
        mock_client.post.return_value = _make_response(json_data=not_found_json)

        result = await scraper.check_company_participation("Empresa Inexistente XYZ")

    assert result is False


@pytest.mark.asyncio
async def test_timeout_retorna_false(scraper):
    with patch("httpx.AsyncClient") as mock_client_cls:
        mock_client = AsyncMock()
        mock_client_cls.return_value.__aenter__.return_value = mock_client
        mock_client.get.side_effect = httpx.TimeoutException("timeout")

        result = await scraper.check_company_participation("Empresa ABC")

    assert result is False


@pytest.mark.asyncio
async def test_error_http_retorna_false(scraper):
    with patch("httpx.AsyncClient") as mock_client_cls:
        mock_client = AsyncMock()
        mock_client_cls.return_value.__aenter__.return_value = mock_client

        request = MagicMock()
        mock_client.get.side_effect = httpx.HTTPStatusError(
            "503 Service Unavailable",
            request=request,
            response=_make_response(status=503),
        )

        result = await scraper.check_company_participation("Empresa ABC")

    assert result is False


def test_normalize_name_elimina_srl(scraper):
    assert scraper._normalize_name("ACSA Bolivia S.R.L.") == "ACSA BOLIVIA"


def test_normalize_name_elimina_sa(scraper):
    assert scraper._normalize_name("Constructora Nacional S.A.") == "CONSTRUCTORA NACIONAL"


def test_normalize_name_elimina_srl_sin_puntos(scraper):
    assert scraper._normalize_name("Logística Andina SRL") == "LOGISTICA ANDINA"


def test_normalize_name_elimina_ltda(scraper):
    assert scraper._normalize_name("Servicios del Sur Ltda") == "SERVICIOS DEL SUR"


def test_normalize_name_mayusculas(scraper):
    assert scraper._normalize_name("empresa ejemplo") == "EMPRESA EJEMPLO"


def test_normalize_name_elimina_sa_sin_puntos(scraper):
    assert scraper._normalize_name("Tech Bolivia SA") == "TECH BOLIVIA"

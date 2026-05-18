import logging
import re

import httpx
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

_LEGAL_SUFFIXES = re.compile(
    r"\s+(S\.R\.L\.|SRL|S\.A\.|SA\.?|LTDA\.?|S\.A\.S\.?)\s*$",
    re.IGNORECASE,
)

_MAIN_URL = "https://sicoes.gob.bo/portal/index.php"
_SEARCH_PAGE_URL = "https://sicoes.gob.bo/portal/contrataciones/busqueda/contResueltos.php"
_SEARCH_API_URL = "https://sicoes.gob.bo/portal/contrataciones/operacion.php"

_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "es-ES,es;q=0.9",
}

_XHR_HEADERS = {
    **_HEADERS,
    "X-Requested-With": "XMLHttpRequest",
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
}


class SicoesScraper:
    async def check_company_participation(self, company_name: str) -> bool:
        """Devuelve True si la empresa tiene contratos resueltos en SICOES."""
        try:
            normalized = self._normalize_name(company_name)
            async with httpx.AsyncClient(
                timeout=10.0, follow_redirects=True
            ) as client:
                main_token = await self._get_main_token(client)
                search_token = await self._get_search_token(client, main_token)
                return await self._search(client, normalized, search_token)
        except httpx.TimeoutException:
            logger.warning("SICOES timeout buscando '%s' — devuelve False", company_name)
            return False
        except Exception as exc:
            logger.warning("SICOES error buscando '%s': %s — devuelve False", company_name, exc)
            return False

    async def _get_main_token(self, client: httpx.AsyncClient) -> str:
        resp = await client.get(_MAIN_URL, headers=_HEADERS)
        return self._extract_token(resp.text) or ""

    async def _get_search_token(self, client: httpx.AsyncClient, main_token: str) -> str:
        url = f"{_SEARCH_PAGE_URL}?token={main_token}"
        resp = await client.get(url, headers={**_HEADERS, "Referer": _MAIN_URL})
        return self._extract_token(resp.text) or main_token

    async def _search(
        self, client: httpx.AsyncClient, company_name: str, token: str
    ) -> bool:
        resp = await client.post(
            _SEARCH_API_URL,
            data={
                "draw": "1",
                "start": "0",
                "length": "1",
                "search[value]": "",
                "search[regex]": "false",
                "operacion": "contResueltos",
                "tipo": "Simple",
                "empresa": company_name,
                "r1": "",
                "autocorrector": "",
                "token": token,
            },
            headers={**_XHR_HEADERS, "Referer": _SEARCH_PAGE_URL, "Origin": "https://sicoes.gob.bo"},
        )
        data = resp.json()
        return int(data.get("recordsFiltered", 0)) > 0

    @staticmethod
    def _extract_token(html: str) -> str:
        soup = BeautifulSoup(html, "html.parser")
        field = soup.find("input", {"name": "token"})
        return field["value"] if field and field.get("value") else ""

    @staticmethod
    def _normalize_name(name: str) -> str:
        """Elimina sufijos legales y convierte a mayúsculas."""
        cleaned = _LEGAL_SUFFIXES.sub("", name)
        # Eliminar puntuación suelta y espacios extra
        cleaned = re.sub(r"[,\.]+", " ", cleaned)
        cleaned = re.sub(r"\s+", " ", cleaned).strip()
        # Eliminar acentos para comparación robusta
        replacements = {
            "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u",
            "ü": "u", "ñ": "n",
            "Á": "A", "É": "E", "Í": "I", "Ó": "O", "Ú": "U",
            "Ü": "U", "Ñ": "N",
        }
        for accented, plain in replacements.items():
            cleaned = cleaned.replace(accented, plain)
        return cleaned.upper()

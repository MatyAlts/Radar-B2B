import asyncio
import logging
from typing import Optional, Dict, Any
import httpx

from src.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class ApolloClient:
    """Cliente HTTP async para Apollo.io API con retry y rate limiting."""

    BASE_URL = "https://api.apollo.io/v1"
    MAX_RETRIES = 3
    INITIAL_BACKOFF = 1  # segundos

    def __init__(self, api_key: str = settings.apollo_api_key):
        self.api_key = api_key
        self.client = httpx.AsyncClient(
            headers={"X-Api-Key": api_key},
            timeout=30.0,
        )

    async def close(self):
        """Cierra la conexión HTTP."""
        await self.client.aclose()

    async def _request_with_retry(
        self, method: str, endpoint: str, **kwargs
    ) -> Dict[str, Any]:
        """Realiza una request con retry exponencial."""
        url = f"{self.BASE_URL}/{endpoint}"
        backoff = self.INITIAL_BACKOFF

        for attempt in range(self.MAX_RETRIES):
            try:
                response = await self.client.request(method, url, **kwargs)

                if response.status_code == 429:  # Rate limit
                    if attempt < self.MAX_RETRIES - 1:
                        await asyncio.sleep(backoff)
                        backoff *= 2
                        continue
                    response.raise_for_status()

                response.raise_for_status()
                return response.json()

            except httpx.HTTPError as e:
                if attempt < self.MAX_RETRIES - 1:
                    logger.warning(f"Request failed (attempt {attempt + 1}): {e}")
                    await asyncio.sleep(backoff)
                    backoff *= 2
                else:
                    logger.error(f"Request failed after {self.MAX_RETRIES} attempts: {e}")
                    raise

    async def search_organizations(
        self,
        industry: Optional[str] = None,
        location: Optional[str] = None,
        min_employees: Optional[int] = None,
        max_employees: Optional[int] = None,
    ) -> list[Dict[str, Any]]:
        """Busca organizaciones en Apollo.io."""
        filters = []

        if industry:
            filters.append({"field_name": "organization_industry", "predicate": "contains", "value": industry})

        if location:
            filters.append({"field_name": "organization_country", "predicate": "contains", "value": location})

        if min_employees:
            filters.append(
                {
                    "field_name": "number_of_employees",
                    "predicate": "gt",
                    "value": min_employees,
                }
            )

        if max_employees:
            filters.append(
                {
                    "field_name": "number_of_employees",
                    "predicate": "lt",
                    "value": max_employees,
                }
            )

        payload = {
            "filters": filters,
            "pagination": {"page": 1, "per_page": 100},
        }

        result = await self._request_with_retry("POST", "organizations/search", json=payload)
        return result.get("organizations", [])

    async def enrich_organization(self, name: str, domain: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """Enriquece datos de una organización."""
        payload = {"name": name}
        if domain:
            payload["domain"] = domain

        try:
            result = await self._request_with_retry("POST", "organizations/enrich", json=payload)
            return result.get("organization")
        except Exception as e:
            logger.error(f"Failed to enrich organization {name}: {e}")
            return None

    async def search_contacts(
        self,
        organization_id: str,
        titles: Optional[list[str]] = None,
    ) -> list[Dict[str, Any]]:
        """Busca contactos en una organización."""
        filters = [
            {"field_name": "organization_id", "predicate": "eq", "value": organization_id},
        ]

        if titles:
            title_filters = [
                {"field_name": "job_title", "predicate": "contains", "value": title} for title in titles
            ]
            filters.extend(title_filters)

        payload = {
            "filters": filters,
            "pagination": {"page": 1, "per_page": 100},
        }

        result = await self._request_with_retry("POST", "contacts/search", json=payload)
        return result.get("contacts", [])

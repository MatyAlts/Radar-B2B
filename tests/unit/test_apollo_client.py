import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from src.infrastructure.apollo.client import ApolloClient


@pytest.fixture
def apollo_client():
    return ApolloClient(api_key="test-api-key")


@pytest.mark.asyncio
async def test_search_organizations(apollo_client):
    """Test búsqueda de organizaciones."""
    mock_response = {
        "organizations": [
            {"id": "1", "name": "Company A", "industry": "Technology"},
            {"id": "2", "name": "Company B", "industry": "Manufacturing"},
        ]
    }

    with patch.object(apollo_client, "_request_with_retry") as mock_request:
        mock_request.return_value = mock_response

        result = await apollo_client.search_organizations(industry="Technology")

        assert len(result) == 2
        assert result[0]["name"] == "Company A"
        mock_request.assert_called_once()


@pytest.mark.asyncio
async def test_enrich_organization(apollo_client):
    """Test enriquecimiento de organización."""
    mock_response = {
        "organization": {
            "id": "1",
            "name": "Company A",
            "domain": "companya.com",
            "employees_count": 500,
        }
    }

    with patch.object(apollo_client, "_request_with_retry") as mock_request:
        mock_request.return_value = mock_response

        result = await apollo_client.enrich_organization("Company A", "companya.com")

        assert result["id"] == "1"
        assert result["employees_count"] == 500


@pytest.mark.asyncio
async def test_search_contacts(apollo_client):
    """Test búsqueda de contactos."""
    mock_response = {
        "contacts": [
            {
                "id": "1",
                "name": "John Doe",
                "job_title": "CEO",
                "email": "john@company.com",
            },
            {
                "id": "2",
                "name": "Jane Smith",
                "job_title": "CFO",
                "email": "jane@company.com",
            },
        ]
    }

    with patch.object(apollo_client, "_request_with_retry") as mock_request:
        mock_request.return_value = mock_response

        result = await apollo_client.search_contacts("org-123", titles=["CEO", "CFO"])

        assert len(result) == 2
        assert result[0]["job_title"] == "CEO"

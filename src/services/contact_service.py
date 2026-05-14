from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from src.domain.entities.contact import Contact
from src.infrastructure.db.repositories.contact_repository import ContactRepository
from src.infrastructure.apollo.client import ApolloClient


class ContactService:
    """Servicio para gestionar contactos (decisores)."""

    def __init__(self, session: AsyncSession, apollo_client: ApolloClient):
        self.repo = ContactRepository(session)
        self.apollo_client = apollo_client

    async def find_decision_makers(self, company_id: str) -> List[Contact]:
        """Encuentra decisores en una empresa."""
        return await self.repo.list_by_company(company_id)

    async def enrich_contacts_from_apollo(
        self, organization_id: str, company_id: str
    ) -> List[Contact]:
        """Obtiene contactos de Apollo.io y los almacena."""
        decision_titles = [
            "Chief Executive Officer",
            "CEO",
            "Gerente General",
            "Dueño",
            "Owner",
            "CFO",
            "Chief Financial Officer",
            "Chief Operations Officer",
            "COO",
        ]

        apollo_contacts = await self.apollo_client.search_contacts(organization_id, decision_titles)

        contacts = []
        for apollo_contact in apollo_contacts:
            contact = Contact(
                company_id=company_id,
                name=apollo_contact.get("name", ""),
                title=apollo_contact.get("job_title", ""),
                email=apollo_contact.get("email"),
                linkedin_url=apollo_contact.get("linkedin_url"),
                phone=apollo_contact.get("phone_number"),
                apollo_id=apollo_contact.get("id"),
                confidence_score=apollo_contact.get("confidence_score", 0.8),
            )

            saved_contact = await self.repo.upsert(contact)
            contacts.append(saved_contact)

        return contacts

    async def upsert_contact(self, company_id: str, contact_data: dict) -> Contact:
        """Crea o actualiza un contacto."""
        contact = Contact(
            company_id=company_id,
            name=contact_data.get("name", ""),
            title=contact_data.get("title", ""),
            email=contact_data.get("email"),
            linkedin_url=contact_data.get("linkedin_url"),
            phone=contact_data.get("phone"),
            confidence_score=contact_data.get("confidence_score", 0.8),
        )

        return await self.repo.upsert(contact)

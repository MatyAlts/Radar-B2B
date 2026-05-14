import uuid
from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.domain.entities.contact import Contact
from src.domain.interfaces.repositories import ContactRepository as IContactRepository
from src.infrastructure.db.models.contact import ContactModel


class ContactRepository(IContactRepository):
    """Implementación concreta del repositorio de contactos."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, contact_id: str) -> Optional[Contact]:
        stmt = select(ContactModel).where(ContactModel.id == contact_id)
        result = await self.session.execute(stmt)
        model = result.scalar_one_or_none()
        return self._model_to_entity(model) if model else None

    async def create(self, contact: Contact) -> Contact:
        if not contact.id:
            contact.id = str(uuid.uuid4())

        model = ContactModel(
            id=contact.id,
            company_id=contact.company_id,
            name=contact.name,
            title=contact.title,
            email=contact.email,
            linkedin_url=contact.linkedin_url,
            phone=contact.phone,
            apollo_id=contact.apollo_id,
            confidence_score=contact.confidence_score,
        )
        self.session.add(model)
        await self.session.flush()
        return self._model_to_entity(model)

    async def list_by_company(self, company_id: str) -> List[Contact]:
        stmt = select(ContactModel).where(ContactModel.company_id == company_id)
        result = await self.session.execute(stmt)
        models = result.scalars().all()
        return [self._model_to_entity(model) for model in models]

    async def upsert(self, contact: Contact) -> Contact:
        if contact.apollo_id:
            stmt = select(ContactModel).where(ContactModel.apollo_id == contact.apollo_id)
            result = await self.session.execute(stmt)
            model = result.scalar_one_or_none()

            if model:
                model.name = contact.name
                model.title = contact.title
                model.email = contact.email
                model.linkedin_url = contact.linkedin_url
                model.phone = contact.phone
                model.confidence_score = contact.confidence_score
                await self.session.flush()
                return self._model_to_entity(model)

        return await self.create(contact)

    @staticmethod
    def _model_to_entity(model: ContactModel) -> Contact:
        return Contact(
            id=model.id,
            company_id=model.company_id,
            name=model.name,
            title=model.title,
            email=model.email,
            linkedin_url=model.linkedin_url,
            phone=model.phone,
            apollo_id=model.apollo_id,
            confidence_score=model.confidence_score,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

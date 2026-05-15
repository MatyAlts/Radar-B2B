from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession

from src.domain.entities.company import Company
from src.domain.entities.contact import Contact
from src.domain.scoring import CompanySignals, calculate_score, determine_temperature
from src.infrastructure.db.repositories.company_repository import CompanyRepository
from src.infrastructure.db.repositories.contact_repository import ContactRepository
from src.infrastructure.apollo.client import ApolloClient
from src.infrastructure.ai.gemini_client import GeminiClient

DECISION_MAKER_TITLES = [
    "CEO", "CFO", "COO", "CTO", "General Manager", "Gerente General",
    "Gerente de Operaciones", "Gerente de Compras", "Jefe de Compras",
    "Director", "Owner", "Dueño", "Presidente", "Vice President",
    "Procurement", "Supply Chain",
]


class CompanyService:
    """Servicio para gestionar empresas."""

    def __init__(self, session: AsyncSession, apollo_client: ApolloClient, gemini_client: Optional[GeminiClient] = None):
        self.repo = CompanyRepository(session)
        self.contact_repo = ContactRepository(session)
        self.apollo_client = apollo_client
        self.gemini = gemini_client

    async def search_companies(
        self,
        industries: Optional[List[str]] = None,
        temperature: Optional[str] = None,
        score_min: Optional[int] = None,
        score_max: Optional[int] = None,
        query: Optional[str] = None,
        skip: int = 0,
        limit: int = 10,
    ) -> tuple[List[Company], int]:
        """Busca empresas con filtros."""
        return await self.repo.list(
            skip=skip,
            limit=limit,
            industries=industries,
            temperature=temperature,
            score_min=score_min,
            score_max=score_max,
            query_str=query
        )

    async def enrich_company(self, company_id: str, domain: str) -> Optional[Company]:
        """Enriquece una empresa existente con datos de Apollo y busca sus decisores."""
        company = await self.repo.get_by_id(company_id)
        if not company:
            return None

        # 1. Enriquecer datos de la organización
        apollo_data = await self.apollo_client.enrich_organization(domain)
        if apollo_data:
            company.apollo_id = apollo_data.get("id") or company.apollo_id
            company.website = apollo_data.get("website_url") or company.website
            company.employee_count = apollo_data.get("estimated_num_employees") or company.employee_count
            company.industry = apollo_data.get("industry") or company.industry
            company.city = apollo_data.get("city") or company.city
            company.country = apollo_data.get("country") or company.country

        # 2. Buscar decisores en Apollo si tenemos el apollo_id
        apollo_org_id = company.apollo_id
        if apollo_org_id:
            try:
                people = await self.apollo_client.search_contacts(
                    organization_ids=[apollo_org_id],
                    titles=DECISION_MAKER_TITLES,
                )
                for person in people:
                    contact = Contact(
                        company_id=company_id,
                        name=f"{person.get('first_name', '')} {person.get('last_name', '')}".strip(),
                        title=person.get("title") or person.get("headline") or "",
                        email=person.get("email"),
                        linkedin_url=person.get("linkedin_url"),
                        phone=person.get("phone") or (person.get("phone_numbers") or [{}])[0].get("sanitized_number"),
                        apollo_id=person.get("id"),
                        confidence_score=0.8 if person.get("email") else 0.4,
                    )
                    await self.contact_repo.upsert(contact)

                if people:
                    company.decision_maker_found = True
            except Exception as e:
                import logging
                logging.getLogger(__name__).warning(
                    f"No se pudieron obtener contactos de Apollo (posible restricción de plan): {e}"
                )

        # 3. Recalcular score con la info actualizada
        return await self.recalculate_score(company)

    async def sync_from_apollo(self, industries: List[str], locations: List[str]) -> List[Company]:
        """Sincroniza empresas desde Apollo basándose en industria y ubicación."""
        apollo_orgs = await self.apollo_client.search_organizations(
            industries=industries,
            locations=locations,
            min_employees=10
        )

        synced_companies = []
        for org in apollo_orgs:
            # Evitar duplicados
            existing = await self.repo.get_by_apollo_id(org.get("id"))
            if existing:
                continue

            # Mapear de Apollo a nuestra Entidad
            company = Company(
                name=org.get("name"),
                website=org.get("website_url") or org.get("primary_domain"),
                apollo_id=org.get("id"),
                industry=org.get("industry"),
                city=org.get("city"),
                country=org.get("country") or (locations[0] if locations else "Bolivia"),
                employee_count=org.get("estimated_num_employees"),
                score=0,
                temperature="frío"
            )
            
            created = await self.repo.create(company)
            synced_companies.append(created)
        
        return synced_companies

    async def get_company_score(self, company_id: str) -> Optional[Company]:
        """Obtiene una empresa con su score."""
        return await self.repo.get_by_id(company_id)

    async def recalculate_score(self, company: Company) -> Company:
        """Recalcula el score de una empresa."""
        signals = CompanySignals(
            strategic_sector=company.strategic_sector,
            recent_growth=company.recent_growth,
            sicoes_participation=company.sicoes_participation,
            adequate_size=company.adequate_size,
            decision_maker_found=company.decision_maker_found,
            purchase_signal=company.purchase_signal,
        )

        company.score = calculate_score(signals)
        company.temperature = determine_temperature(company.score)

        if self.gemini:
            company.score_justification = await self.gemini.generate_score_justification(company, signals)
        else:
            company.score_justification = self._generate_justification(company, signals)

        return await self.repo.update(company)

    def _generate_justification(self, company: Company, signals: CompanySignals) -> str:
        """Genera una justificación en lenguaje natural basada en las señales activas."""
        active_parts = []
        inactive_parts = []

        if signals.strategic_sector:
            active_parts.append("opera en un sector estratégico de alto valor comercial")
        else:
            inactive_parts.append("no está clasificada en un sector estratégico prioritario")

        if signals.recent_growth:
            active_parts.append("muestra señales de crecimiento o expansión reciente")
        else:
            inactive_parts.append("no presenta noticias de crecimiento detectadas")

        if signals.sicoes_participation:
            active_parts.append("tiene participación activa en licitaciones públicas (SICOES)")
        else:
            inactive_parts.append("no registra participación en licitaciones públicas")

        if signals.adequate_size:
            active_parts.append("su tamaño de equipo es adecuado para el perfil objetivo")
        else:
            inactive_parts.append("su tamaño no coincide con el perfil objetivo")

        if signals.decision_maker_found:
            active_parts.append("se identificaron decisores clave con información de contacto")
        else:
            inactive_parts.append("aún no se identificaron decisores clave")

        if signals.purchase_signal:
            active_parts.append("presenta señales directas de intención de compra")
        else:
            inactive_parts.append("no se detectaron señales directas de compra")

        name = company.name or "La empresa"
        temperature = company.temperature

        if active_parts:
            active_text = ", ".join(active_parts[:-1])
            if len(active_parts) > 1:
                active_text += f" y {active_parts[-1]}"
            else:
                active_text = active_parts[0]
            summary = f"{name} obtuvo un score de {company.score}/100 ({temperature}). "
            summary += f"Los factores positivos son: {active_text}."
        else:
            summary = f"{name} obtuvo un score de {company.score}/100 ({temperature}). "
            summary += "No se detectaron señales positivas en esta evaluación."

        if inactive_parts and company.score < 100:
            inactive_text = ", ".join(inactive_parts[:-1])
            if len(inactive_parts) > 1:
                inactive_text += f" y {inactive_parts[-1]}"
            else:
                inactive_text = inactive_parts[0]
            summary += f" Para mejorar el score, se recomienda verificar que {inactive_text}."

        return summary

    async def get_company_contacts(self, company_id: str) -> List[dict]:
        """Obtiene los contactos de una empresa."""
        from sqlalchemy import select
        from src.infrastructure.db.models.contact import ContactModel
        
        stmt = select(ContactModel).where(ContactModel.company_id == company_id)
        result = await self.repo.session.execute(stmt)
        models = result.scalars().all()
        
        def confidence_to_reliability(score: float) -> str:
            if score >= 0.7:
                return "high"
            elif score >= 0.4:
                return "medium"
            return "low"

        return [
            {
                "id": m.id,
                "company_id": m.company_id,
                "name": m.name,
                "title": m.title,
                "email": m.email,
                "phone": m.phone,
                "linkedin_url": m.linkedin_url,
                "reliability": confidence_to_reliability(m.confidence_score or 0.0),
                "last_updated_at": m.updated_at.isoformat() if m.updated_at else None,
            } for m in models
        ]

    async def delete_company(self, company_id: str) -> bool:
        """Elimina una empresa."""
        return await self.repo.delete(company_id)

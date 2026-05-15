import asyncio
import uuid
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from src.infrastructure.db.session import AsyncSessionLocal, engine
from src.infrastructure.db.models.company import CompanyModel
from src.infrastructure.db.models.contact import ContactModel
from src.infrastructure.db.models.signal import SignalModel

async def seed_data():
    async with AsyncSessionLocal() as session:
        # Check if already seeded
        from sqlalchemy import select
        result = await session.execute(select(CompanyModel).limit(1))
        if result.scalar():
            print("Database already seeded.")
            return

        print("Seeding database with sample companies...")

        companies = [
            {
                "id": str(uuid.uuid4()),
                "name": "Minera San Cristóbal",
                "industry": "mineria",
                "city": "Potosí",
                "country": "Bolivia",
                "score": 92,
                "temperature": "caliente",
                "employee_count": 1200,
                "website": "https://www.minerasancristobal.com",
                "strategic_sector": True,
                "recent_growth": True,
                "sicoes_participation": True,
                "adequate_size": True,
                "decision_maker_found": True,
                "purchase_signal": True,
                "score_justification": "Empresa grande en sector estratégico con señales de crecimiento e inversión.",
                "contacts": [
                    {"name": "Jorge Mendez", "title": "Gerente General", "email": "jorge.mendez@msc.com.bo"},
                    {"name": "Patricia Ruiz", "title": "Jefe de Compras", "email": "p.ruiz@msc.com.bo"}
                ],
                "signals": [
                    {"type": "expansion", "desc": "Proyecto de ampliación de planta detectado", "source": "news"},
                    {"type": "tender", "desc": "Licitación abierta para suministro de maquinaria", "source": "sicoes"}
                ]
            },
            {
                "id": str(uuid.uuid4()),
                "name": "LogistiCenter Bolivia",
                "industry": "logistica",
                "city": "Santa Cruz",
                "country": "Bolivia",
                "score": 78,
                "temperature": "caliente",
                "employee_count": 250,
                "website": "https://www.logisticenter.bo",
                "strategic_sector": True,
                "recent_growth": True,
                "sicoes_participation": False,
                "adequate_size": True,
                "decision_maker_found": True,
                "purchase_signal": True,
                "score_justification": "Empresa de logística con expansión reciente en Santa Cruz.",
                "contacts": [
                    {"name": "Carlos López", "title": "Gerente de Operaciones", "email": "c.lopez@logisticenter.bo"}
                ],
                "signals": [
                    {"type": "growth", "desc": "Inauguración de nuevo centro de distribución", "source": "news"}
                ]
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Banco Unión SA",
                "industry": "almacenamiento",
                "city": "La Paz",
                "country": "Bolivia",
                "score": 65,
                "temperature": "tibio",
                "employee_count": 5000,
                "website": "https://www.bancounion.com.bo",
                "strategic_sector": False,
                "recent_growth": False,
                "sicoes_participation": True,
                "adequate_size": True,
                "decision_maker_found": False,
                "purchase_signal": True,
                "score_justification": "Banco estatal con alta participación en licitaciones de tecnología.",
                "contacts": [],
                "signals": [
                    {"type": "tender", "desc": "Licitación para renovación de centro de datos", "source": "sicoes"}
                ]
            }
        ]

        for company_data in companies:
            contacts = company_data.pop("contacts")
            signals = company_data.pop("signals")
            
            company = CompanyModel(**company_data)
            session.add(company)
            
            for contact_data in contacts:
                contact = ContactModel(
                    id=str(uuid.uuid4()),
                    company_id=company.id,
                    **contact_data
                )
                session.add(contact)
                
            for signal_data in signals:
                signal = SignalModel(
                    id=str(uuid.uuid4()),
                    company_id=company.id,
                    signal_type=signal_data["type"],
                    description=signal_data["desc"],
                    source=signal_data["source"]
                )
                session.add(signal)

        await session.commit()
        print("Database seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed_data())

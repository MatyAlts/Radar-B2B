import asyncio
import logging
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from src.config import get_settings
from src.infrastructure.apollo.client import ApolloClient
from src.services.company_service import CompanyService

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)


async def sync_sicoes():
    load_dotenv(override=True)
    settings = get_settings()

    engine = create_async_engine(settings.database_url)
    AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    logger.info("Iniciando sync SICOES...")

    async with AsyncSessionLocal() as session:
        apollo_client = ApolloClient(api_key=os.getenv("APOLLO_API_KEY", ""))
        service = CompanyService(session=session, apollo_client=apollo_client)

        companies, total = await service.search_companies(limit=10000)
        logger.info("Empresas a procesar: %d", total)

        processed = 0
        found = 0

        for company in companies:
            try:
                updated = await service.enrich_sicoes(str(company.id))
                if updated and updated.sicoes_participation:
                    found += 1
                    logger.info("✓ %s → sicoes_participation=True (score=%s)", company.name, updated.score)
                processed += 1
                await session.commit()
                logger.info("Progreso: %d/%d | con SICOES: %d", processed, total, found)
                await asyncio.sleep(1)
            except Exception as exc:
                await session.rollback()
                logger.warning("Error procesando %s: %s", company.name, exc)

    logger.info("Sync finalizado. Procesadas: %d | Con participación SICOES: %d", processed, found)


if __name__ == "__main__":
    asyncio.run(sync_sicoes())

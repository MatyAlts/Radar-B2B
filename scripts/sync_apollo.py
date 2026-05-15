import asyncio
import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from src.infrastructure.apollo.client import ApolloClient
from src.services.company_service import CompanyService
from src.config import get_settings

async def sync_data():
    load_dotenv(override=True)
    settings = get_settings()
    api_key = os.getenv("APOLLO_API_KEY")
    
    if not api_key or api_key == "placeholder":
        print("❌ Error: APOLLO_API_KEY no detectada correctamente.")
        return

    engine = create_async_engine(settings.database_url)
    AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    print(f"🚀 Iniciando sincronización masiva desde Apollo.io con key {api_key[:5]}...")
    
    industries = [
        "Mining", 
        "Logistics & Supply Chain", 
        "Farming", 
        "Mechanical or Industrial Engineering", 
        "Warehousing",
        "Oil & Energy"
    ]
    locations = ["Bolivia"]
    
    async with AsyncSessionLocal() as session:
        apollo_client = ApolloClient(api_key)
        service = CompanyService(session, apollo_client)
        
        try:
            synced = await service.sync_from_apollo(industries, locations)
            print(f"✅ Sincronización completada. Se añadieron {len(synced)} nuevas empresas.")
            
            # Commit changes
            await session.commit()
            
        except Exception as e:
            print(f"❌ Error durante la sincronización: {e}")
            await session.rollback()
        finally:
            await apollo_client.close()
    
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(sync_data())

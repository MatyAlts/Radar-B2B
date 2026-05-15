import asyncio
import os
from dotenv import load_dotenv
from src.infrastructure.apollo.client import ApolloClient

async def test_apollo():
    load_dotenv(override=True)
    api_key = os.getenv("APOLLO_API_KEY")
    
    if not api_key or api_key == "your_apollo_api_key_here":
        print("❌ Error: APOLLO_API_KEY no configurada correctamente en .env")
        return

    print(f"Testing Apollo API with key: {api_key[:5]}...")
    client = ApolloClient(api_key)
    
    try:
        # Intento: organizations/search (POST)
        print("Intentando organizations/search (POST)...")
        try:
            results = await client.search_organizations(
                industries=["Mining"],
                locations=["Bolivia"]
            )
            print(f"✅ Conexión exitosa con organizations/search (POST)! Se encontraron {len(results)} empresas.")
            if results:
                company = results[0]
                print(f"Ejemplo: {company.get('name')} (ID: {company.get('id')})")
                
                # Prueba de contactos
                print(f"Buscando contactos para {company.get('name')}...")
                contacts = await client.search_contacts(
                    organization_ids=[company.get("id")],
                    titles=["Gerente", "Compras", "Manager"]
                )
                print(f"✅ Se encontraron {len(contacts)} contactos.")
                if contacts:
                    print(f"Ejemplo contacto: {contacts[0].get('name')} - {contacts[0].get('title')}")
        except Exception as e:
            print(f"❌ organizations/search falló: {e}")

    except Exception as e:
        print(f"❌ Error crítico: {e}")
        print(f"❌ Error crítico: {e}")
    finally:
        await client.close()

if __name__ == "__main__":
    asyncio.run(test_apollo())

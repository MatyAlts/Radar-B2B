from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from src.config import get_settings
from src.api.routers import companies, signals

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    yield
    # Shutdown


app = FastAPI(
    title="Radar B2B Inteligente API",
    description="Plataforma de detección de empresas con probabilidad de compra",
    version="0.1.0",
    openapi_url=f"{settings.api_prefix}/openapi.json",
    docs_url=f"{settings.api_prefix}/docs",
    redoc_url=f"{settings.api_prefix}/redoc",
    lifespan=lifespan,
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(companies.router, prefix=settings.api_prefix)
app.include_router(signals.router, prefix=settings.api_prefix)


@app.get(f"{settings.api_prefix}/health")
async def health_check():
    """Endpoint de salud para verificar que el API está funcionando."""
    return {"status": "ok", "service": "radar-b2b-api"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=settings.debug)

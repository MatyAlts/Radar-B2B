from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from src.config import get_settings

settings = get_settings()

# Crear engine async
engine = create_async_engine(
    settings.database_url,
    echo=False,
    future=True,
    pool_pre_ping=True,
    pool_recycle=3600,
)

# Crear session factory
AsyncSessionLocal = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)


async def get_session() -> AsyncSession:
    """Dependency para obtener la sesión de base de datos."""
    async with AsyncSessionLocal() as session:
        yield session


async def init_db():
    """Inicializa la base de datos (crea las tablas)."""
    from src.infrastructure.db.models.company import Base

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def close_db():
    """Cierra la conexión con la base de datos."""
    await engine.dispose()

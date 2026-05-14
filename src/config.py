from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Configuración de la aplicación cargada desde variables de entorno."""

    # Database
    database_url: str

    # APIs externas
    apollo_api_key: str
    anthropic_api_key: str

    # Configuración
    api_prefix: str = "/api/v1"
    debug: bool = False
    cors_origins: list[str] = ["http://localhost:3000", "http://localhost:3001"]

    # Scheduler
    scheduler_enabled: bool = True
    sicoes_update_interval_hours: int = 6

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Retorna la instancia única de configuración."""
    return Settings()

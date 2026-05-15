from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Configuración de la aplicación cargada desde variables de entorno."""

    # Database
    database_url: str

    # APIs externas
    apollo_api_key: str
    gemini_api_key: str

    # Configuración
    api_prefix: str = "/api/v1"
    debug: bool = False
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:13000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:13000",
    ]

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

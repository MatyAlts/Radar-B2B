## Context

Proyecto nuevo (net-new) sin código previo. El backend del Radar B2B necesita conectar tres fuentes externas (Apollo.io, SICOES, Claude API), persistir los datos en PostgreSQL, y exponer una API REST que el frontend va a consumir.

El equipo sigue Clean Architecture y TDD estricto. El MVP debe poder desplegarse localmente con Docker Compose y estar listo para escalar a producción en cloud.

## Goals / Non-Goals

**Goals:**
- Estructura de proyecto FastAPI con capas claras (api / domain / infrastructure / services)
- Esquema de base de datos inicial con Alembic para migraciones
- Integración funcional con Apollo.io (búsqueda + enriquecimiento)
- Integración funcional con SICOES (scraping de licitaciones)
- Motor de scoring con lógica determinista + justificación por Claude API
- API REST documentada (OpenAPI) consumible por el frontend
- Suite de tests con pytest (unit + integration) desde el día uno
- Docker Compose para desarrollo local

**Non-Goals:**
- Frontend (se hace en un change separado)
- Scraping de prensa industrial (fase 2)
- Reportes automáticos por email/PDF (fase 2)
- Autenticación de usuarios / multi-tenant (fase 2)
- Deploy a producción en cloud (fase 2)

## Decisions

### 1. Clean Architecture con capas explícitas

**Decisión:** Estructura `src/` con cuatro capas: `api/`, `domain/`, `infrastructure/`, `services/`.

```
src/
├── api/              # FastAPI routers, schemas Pydantic, dependencias
├── domain/           # Entidades, value objects, interfaces de repositorios
├── infrastructure/   # Implementaciones: PostgreSQL, Apollo, SICOES, Claude
└── services/         # Casos de uso (orquestan domain + infrastructure)
```

**Por qué:** La regla de dependencia (domain no conoce infrastructure) permite testear la lógica de negocio sin tocar la base de datos ni las APIs externas. Fundamental para TDD.

**Alternativa descartada:** FastAPI flat structure (routers + models en el mismo nivel) — escala muy mal y mezcla responsabilidades.

---

### 2. SQLAlchemy 2.x + Alembic para persistencia

**Decisión:** SQLAlchemy 2.x (async con asyncpg) como ORM, Alembic para migraciones.

**Por qué:** SQLAlchemy 2.x tiene soporte nativo async compatible con FastAPI. Alembic da control total sobre el esquema y permite rollbacks limpios. SQLModel (alternativa) mezcla capas de Pydantic y ORM, lo cual viola la separación de domain vs infrastructure.

**Alternativa descartada:** Tortoise ORM — menos maduro, comunidad más chica.

---

### 3. Motor de scoring: lógica determinista primero, IA para la justificación

**Decisión:** El score numérico (0-100) se calcula con lógica determinista en `domain/scoring.py`. Claude API solo genera el texto de justificación en lenguaje natural.

```python
# Pesos en domain — sin dependencia de IA
WEIGHTS = {
    "strategic_sector": 20,
    "recent_growth": 15,
    "sicoes_participation": 20,
    "adequate_size": 10,
    "decision_maker_found": 15,
    "purchase_signal": 20,
}
```

**Por qué:** El score debe ser reproducible y testeable sin llamadas a la API. Si Claude falla o es lento, el score sigue calculándose. La justificación es un "nice to have" asíncrono.

**Alternativa descartada:** Delegar todo el scoring a IA — no determinista, costoso, imposible de testear con TDD.

---

### 4. Apollo.io: cliente HTTP propio con retry y rate limiting

**Decisión:** Implementar un cliente HTTP liviano sobre `httpx` (async) con retry exponencial y respeto del rate limit de Apollo (600 req/min en plan básico).

**Por qué:** No hay SDK oficial de Apollo para Python con soporte async. Un cliente propio permite mockear fácilmente en tests y controlar el comportamiento de retry.

**Alternativa descartada:** `requests` síncrono — bloquea el event loop de FastAPI.

---

### 5. SICOES: scraping con BeautifulSoup + caché en PostgreSQL

**Decisión:** Scraping directo del portal SICOES usando `httpx` + `BeautifulSoup`. Los datos se persisten en PostgreSQL con timestamp de última actualización. Un job (APScheduler) actualiza periódicamente.

**Por qué:** SICOES no tiene API pública documentada. El scraping es la única opción viable para MVP. La caché en DB evita hits repetidos al portal.

**Alternativa descartada:** Re-scraping en cada request — lento e irrespetuoso con el portal.

---

### 6. Configuración con Pydantic Settings

**Decisión:** `pydantic-settings` para cargar y validar todas las variables de entorno al arrancar. Falla rápido si falta alguna variable crítica.

**Por qué:** Evita errores silenciosos en runtime por variables faltantes. Compatible con `.env` para desarrollo local y variables de entorno reales en producción.

## Risks / Trade-offs

- **[Risk] Apollo.io rate limits** → Mitigation: implementar retry con backoff exponencial y queue local para requests. Monitorear consumo de la cuota.

- **[Risk] SICOES cambia su HTML sin previo aviso** → Mitigation: tests de integración que detecten cambios de estructura. Alertas cuando el scraper retorna 0 resultados.

- **[Risk] Latencia de Claude API en scoring** → Mitigation: la justificación se genera de forma asíncrona (background task). El endpoint de scoring devuelve el número inmediatamente y la justificación se actualiza después.

- **[Trade-off] SQLAlchemy async vs simplidad** → La complejidad inicial de configurar el engine async se compensa con el mejor desempeño bajo carga. Para MVP el overhead es aceptable.

- **[Risk] Cobertura de SICOES incompleta** → No todos los contratos públicos bolivianos están en SICOES o están bien estructurados. El MVP acepta datos parciales; se mejora iterativamente.

## Migration Plan

1. Crear estructura de proyecto con `fastapi`, dependencias y `pyproject.toml`
2. Configurar Docker Compose: FastAPI + PostgreSQL
3. Crear modelos SQLAlchemy + primera migración Alembic
4. Implementar domain entities y interfaces de repositorios
5. Implementar infrastructure (Apollo, SICOES, Claude, PostgreSQL repos)
6. Implementar services (casos de uso)
7. Exponer API REST con FastAPI routers
8. Tests unitarios e de integración con pytest

**Rollback:** No aplica — proyecto nuevo. Si una fase falla, se revierte el commit.

## Open Questions

- ¿Apollo.io plan actual? Confirmar límites de rate y campos disponibles en el tier contratado.
- ¿SICOES tiene alguna API no documentada o solo scraping web? Vale la pena investigar antes de implementar.
- ¿El scoring de "sector estratégico" es configurable por el usuario o fijo en código para MVP?

## Why

El Radar B2B Inteligente necesita una base sólida de backend para poder detectar, enriquecer y puntuar empresas bolivianas con señales de compra. Sin este MVP, no hay producto — es el cimiento sobre el que todo lo demás se construye.

## What Changes

- Nuevo proyecto FastAPI con estructura Clean Architecture (api / domain / infrastructure / services)
- Modelos de base de datos PostgreSQL para empresas, contactos (decisores), señales y scores
- Integración con Apollo.io para búsqueda y enriquecimiento de empresas y decisores
- Integración con SICOES para detección de licitaciones y contratación pública
- Motor de scoring híbrido (0-100) con justificación generada por Claude API
- API REST documentada (OpenAPI/Swagger) para consumo desde el frontend
- Sistema de configuración por variables de entorno con validación (Pydantic Settings)
- Suite de tests con pytest en modo TDD

## Capabilities

### New Capabilities

- `company-search`: Búsqueda y listado de empresas por industria, ubicación y tamaño usando Apollo.io como fuente principal
- `contact-enrichment`: Enriquecimiento de contactos clave (decisores) con email, LinkedIn y teléfono vía Apollo.io
- `sicoes-integration`: Ingesta y consulta de procesos de contratación pública desde SICOES Bolivia
- `scoring-engine`: Motor de scoring híbrido (0-100) con pesos configurables y justificación en lenguaje natural generada por Claude API
- `company-signals`: Detección y almacenamiento de señales de compra (noticias, licitaciones, crecimiento)
- `api-layer`: Capa REST con FastAPI: endpoints para empresas, contactos, señales y scoring

### Modified Capabilities

## Impact

- **Nuevo proyecto**: Todo es net-new, no hay código existente que migrar
- **Base de datos**: Esquema inicial de PostgreSQL (empresas, contactos, señales, scores, licitaciones)
- **Dependencias externas**: Apollo.io API, SICOES (scraping/API pública), Anthropic API
- **Variables de entorno**: `APOLLO_API_KEY`, `DATABASE_URL`, `ANTHROPIC_API_KEY`
- **Infraestructura**: Docker Compose para desarrollo local (FastAPI + PostgreSQL)

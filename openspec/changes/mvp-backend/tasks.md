## 1. Scaffolding del proyecto

- [ ] 1.1 Crear estructura de directorios: `src/api/`, `src/domain/`, `src/infrastructure/`, `src/services/`, `tests/unit/`, `tests/integration/`
- [ ] 1.2 Crear `pyproject.toml` con dependencias: fastapi, uvicorn, sqlalchemy[asyncio], asyncpg, alembic, httpx, beautifulsoup4, pydantic-settings, anthropic, apscheduler, pytest, pytest-asyncio
- [ ] 1.3 Crear `src/config.py` con Pydantic Settings: `DATABASE_URL`, `APOLLO_API_KEY`, `ANTHROPIC_API_KEY`. Falla al arrancar si faltan variables requeridas
- [ ] 1.4 Crear `docker-compose.yml` con servicios: `api` (FastAPI) y `db` (PostgreSQL 15)
- [ ] 1.5 Crear `.env.example` con todas las variables requeridas documentadas
- [ ] 1.6 Crear `src/main.py` con app FastAPI, CORS para `localhost:3000`, y endpoint `GET /api/v1/health`

## 2. Modelos de dominio

- [ ] 2.1 Crear `src/domain/entities/company.py`: entidad `Company` con señales booleanas (strategic_sector, recent_growth, sicoes_participation, adequate_size, decision_maker_found, purchase_signal), score, temperature
- [ ] 2.2 Crear `src/domain/entities/contact.py`: entidad `Contact` con nombre, cargo, email, linkedin_url, teléfono, confiabilidad
- [ ] 2.3 Crear `src/domain/entities/signal.py`: entidad `CompanySignal` con tipo, fuente, descripción, relevancia, detectada_en
- [ ] 2.4 Crear `src/domain/entities/tender.py`: entidad `Tender` con número de proceso, entidad convocante, objeto, monto, estado
- [ ] 2.5 Crear `src/domain/scoring.py`: función `calculate_score(signals: CompanySignals) -> int` con los pesos definidos. Tests unitarios primero (TDD)
- [ ] 2.6 Crear `src/domain/interfaces/`: repositorios abstractos `CompanyRepository`, `ContactRepository`, `SignalRepository`, `TenderRepository`

## 3. Capa de infraestructura — Base de datos

- [ ] 3.1 Crear modelos SQLAlchemy en `src/infrastructure/db/models/`: `CompanyModel`, `ContactModel`, `SignalModel`, `TenderModel`, `CompanySicoesProcessModel`
- [ ] 3.2 Configurar Alembic: `alembic init alembic/`, crear migración inicial con todos los modelos
- [ ] 3.3 Crear `src/infrastructure/db/session.py`: async engine + session factory
- [ ] 3.4 Implementar `src/infrastructure/db/repositories/`: implementaciones concretas de los repositorios del dominio
- [ ] 3.5 Escribir tests de integración para cada repositorio (requiere DB de test)

## 4. Capa de infraestructura — Apollo.io

- [ ] 4.1 Crear `src/infrastructure/apollo/client.py`: cliente HTTP async sobre `httpx` con retry exponencial (max 3 intentos) y respeto de rate limit
- [ ] 4.2 Implementar `search_organizations(industry, location, min_employees, max_employees)` → lista de empresas
- [ ] 4.3 Implementar `enrich_organization(name, domain)` → datos enriquecidos de empresa
- [ ] 4.4 Implementar `search_contacts(organization_id, titles)` → lista de decisores por cargo
- [ ] 4.5 Escribir tests unitarios con mocks del cliente HTTP

## 5. Capa de infraestructura — SICOES

- [ ] 5.1 Crear `src/infrastructure/sicoes/scraper.py`: scraper con `httpx` + `BeautifulSoup` para extraer licitaciones activas
- [ ] 5.2 Implementar parsing de campos: número de proceso, entidad, objeto, monto, fechas, estado
- [ ] 5.3 Implementar fuzzy matching de nombres de empresa (usar `rapidfuzz`, umbral 80%)
- [ ] 5.4 Crear `src/infrastructure/sicoes/job.py`: job con APScheduler para actualización periódica (configurable, default 6 horas)
- [ ] 5.5 Escribir tests unitarios con HTML fixtures del portal SICOES

## 6. Capa de infraestructura — Claude API

- [ ] 6.1 Crear `src/infrastructure/ai/claude_client.py`: cliente Anthropic con prompt para generar justificación de score
- [ ] 6.2 Implementar `generate_score_justification(company: Company, signals: dict) -> str`: retorna texto en español explicando el score
- [ ] 6.3 Integrar como background task en FastAPI: encolar la generación al calcular el score
- [ ] 6.4 Escribir tests unitarios con mock de la respuesta de Claude

## 7. Servicios (casos de uso)

- [ ] 7.1 Crear `src/services/company_service.py`: `search_companies(filters)`, `enrich_company(name, domain)`, `get_company_score(company_id)`
- [ ] 7.2 Crear `src/services/contact_service.py`: `find_decision_makers(company_id)`, `upsert_contact(company_id, contact_data)`
- [ ] 7.3 Crear `src/services/signal_service.py`: `register_signal(company_id, signal_data)`, `get_company_signals(company_id)`
- [ ] 7.4 Crear `src/services/scoring_service.py`: `recalculate_score(company_id)` — llama a `domain/scoring.py`, persiste, encola justificación
- [ ] 7.5 Escribir tests unitarios para cada servicio con repositorios mock

## 8. API REST (routers FastAPI)

- [ ] 8.1 Crear `src/api/routers/companies.py`: `GET /api/v1/companies`, `POST /api/v1/companies/enrich`, `GET /api/v1/companies/{id}`, `GET /api/v1/companies/{id}/score`
- [ ] 8.2 Crear `src/api/routers/contacts.py`: `GET /api/v1/companies/{id}/contacts`
- [ ] 8.3 Crear `src/api/routers/signals.py`: `GET /api/v1/companies/{id}/signals`
- [ ] 8.4 Crear `src/api/routers/tenders.py`: `GET /api/v1/companies/{id}/tenders`
- [ ] 8.5 Crear `src/api/schemas/`: schemas Pydantic para requests y responses de cada endpoint
- [ ] 8.6 Implementar error handlers estandarizados (404, 422, 500) con formato `{"error": ..., "message": ...}`
- [ ] 8.7 Implementar paginación estándar con helper reutilizable (page, limit, total, pages)

## 9. Tests de integración end-to-end

- [ ] 9.1 Configurar `conftest.py` con base de datos de test (PostgreSQL en Docker) y fixtures base
- [ ] 9.2 Test e2e: búsqueda de empresas con filtros y paginación
- [ ] 9.3 Test e2e: enriquecimiento de empresa + creación de contactos + recálculo de score
- [ ] 9.4 Test e2e: ingesta de licitaciones SICOES + cruce con empresas + señal registrada
- [ ] 9.5 Test e2e: score calculado correctamente con diferentes combinaciones de señales

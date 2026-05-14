## ADDED Requirements

### Requirement: Búsqueda de empresas por filtros
El sistema SHALL permitir buscar empresas usando combinación de filtros: industria, ubicación (país/ciudad) y tamaño (rango de empleados). Debe retornar resultados paginados.

#### Scenario: Búsqueda por industria
- **WHEN** se llama `GET /api/v1/companies?industry=logistica&page=1&limit=20`
- **THEN** el sistema retorna una lista paginada de empresas del sector logístico con campos: id, nombre, industria, ubicación, tamaño_empleados, score_actual, fecha_actualización

#### Scenario: Búsqueda con múltiples filtros
- **WHEN** se llama con `industry=mineria&city=Santa Cruz&min_employees=50&max_employees=500`
- **THEN** retorna solo empresas que cumplen TODOS los filtros simultáneamente

#### Scenario: Sin resultados
- **WHEN** se busca con filtros que no tienen match en la base de datos
- **THEN** retorna `{"items": [], "total": 0, "page": 1}` con status 200

### Requirement: Enriquecimiento de empresa desde Apollo
El sistema SHALL consultar Apollo.io para enriquecer los datos de una empresa dado su nombre o dominio, y persistir el resultado en PostgreSQL.

#### Scenario: Enriquecimiento exitoso
- **WHEN** se llama `POST /api/v1/companies/enrich` con `{"name": "Aceros Bolivia S.A.", "domain": "acerosbolivia.com"}`
- **THEN** el sistema consulta Apollo, persiste los datos y retorna la empresa con campos enriquecidos (employees_count, revenue_range, technologies, linkedin_url)

#### Scenario: Empresa no encontrada en Apollo
- **WHEN** Apollo no encuentra la empresa
- **THEN** el sistema persiste la empresa con los datos disponibles y marca `apollo_enriched: false`

#### Scenario: Apollo rate limit excedido
- **WHEN** Apollo retorna 429 Too Many Requests
- **THEN** el cliente reintenta con backoff exponencial (max 3 intentos) antes de retornar error 503

### Requirement: Listado de empresas con score
El sistema SHALL exponer un endpoint que retorne empresas ordenadas por score descendente, con soporte de filtros de clasificación (caliente/tibio/frío).

#### Scenario: Listado por score
- **WHEN** se llama `GET /api/v1/companies?order_by=score&order=desc`
- **THEN** retorna empresas ordenadas de mayor a menor score, con campo `temperature` calculado: caliente (≥70), tibio (40-69), frío (<40)

#### Scenario: Filtro por temperatura
- **WHEN** se llama `GET /api/v1/companies?temperature=caliente`
- **THEN** retorna solo empresas con score ≥ 70

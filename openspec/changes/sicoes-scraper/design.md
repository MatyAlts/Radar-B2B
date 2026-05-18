## Context

SICOES (`sicoes.gob.bo`) es el sistema de contrataciones estatales de Bolivia. No tiene API pública — toda la información está en HTML. Para el MVP, la única información que necesitamos es **si una empresa aparece como adjudicada** en algún proceso de contratación. Apollo.io fue investigado y confirmado: no trae datos de SICOES ni de contrataciones públicas bolivianas.

El proyecto ya tiene:
- `src/infrastructure/sicoes/__init__.py` que importa `SicoesScraper` (el archivo no existe aún)
- `Company.sicoes_participation: bool` en el modelo de dominio y en la DB
- `CompanyService` en `src/services/company_service.py` con patrón de enriquecimiento existente (Apollo)
- `httpx` como cliente HTTP ya instalado

## Goals / Non-Goals

**Goals:**
- Implementar `SicoesScraper.check_company_participation(company_name: str) -> bool`
- Integrar el scraper en `CompanyService` con un método `enrich_sicoes(company_id: str)`
- Actualizar `sicoes_participation` y recalcular score tras el enriquecimiento
- Tests unitarios con mocks de HTTP (sin llamadas reales a SICOES)

**Non-Goals:**
- Guardar las licitaciones individuales en la DB (eso es nivel "medio", no MVP)
- Scraping masivo o crawl de todo SICOES
- Scheduler automático (puede ejecutarse manualmente vía script)
- Parsing de montos, fechas ni detalles de contratos

## Decisions

### D1: Búsqueda por nombre vía query string, no crawl completo

**Decisión:** El scraper busca directamente por nombre de empresa usando el formulario de búsqueda de SICOES, en lugar de descargar y parsear toda la base de datos.

**Alternativas consideradas:**
- Crawl completo de adjudicaciones → demasiado volumen, frágil, innecesario para MVP
- API de datos abiertos del Estado boliviano → no existe para SICOES

**Rationale:** Mínimo impacto en el servidor de SICOES, mínima complejidad, suficiente para el flag booleano.

### D2: Resultado booleano puro, sin cache en DB de tenders

**Decisión:** `check_company_participation` retorna `bool`. No se guarda ningún `Tender` en la DB durante este change.

**Rationale:** El MVP solo necesita el flag para el score. El `TenderRepository` existe y está listo para cuando se quiera implementar nivel "medio", pero no se toca ahora.

### D3: httpx async (ya disponible en el proyecto)

**Decisión:** Usar `httpx.AsyncClient` consistente con `ApolloClient`.

**Alternativas consideradas:**
- `requests` (sync) → no compatible con el stack async de FastAPI
- `playwright` → overhead enorme para solo leer HTML estático

### D4: Fuzzy matching no requerido en MVP

**Decisión:** Se busca el nombre exacto (o normalizado: sin puntuación, mayúsculas). Si hay 1+ resultados → `True`. Sin resultados → `False`.

**Rationale:** SICOES registra nombres legales de empresas. Apollo puede traer nombres ligeramente distintos, pero para el MVP aceptamos falsos negativos ocasionales antes de agregar complejidad de matching.

### D5: Timeout agresivo con fallback a False

**Decisión:** Si SICOES no responde en 10s o retorna error HTTP → `check_company_participation` retorna `False` (no lanza excepción).

**Rationale:** El enriquecimiento SICOES es una señal de mejora, no un flujo crítico. Un timeout no debe romper el scoring — simplemente no suma los 20 puntos.

## Risks / Trade-offs

- **[Riesgo] HTML de SICOES puede cambiar sin aviso** → Mitigation: el scraper está aislado en `infrastructure/sicoes/`. Cuando cambie, hay un solo lugar a actualizar. Loguear el HTML cuando el parsing falla para facilitar debug.

- **[Riesgo] SICOES puede bloquear IPs por requests frecuentes** → Mitigation: el scraper se usa on-demand (por empresa, no en bulk automático). Agregar `User-Agent` realista y delay mínimo entre requests en batch.

- **[Riesgo] Nombres en SICOES usan razón social completa ("ACSA BOLIVIA S.R.L.")** → Mitigation: normalizar ambos nombres antes de buscar (quitar S.R.L., S.A., SRL, mayúsculas). Aceptar falsos negativos en MVP.

- **[Trade-off] Sin cache** → Cada llamada a `enrich_sicoes` hace una request HTTP a SICOES. Para el MVP con pocas empresas está bien. Para escalar: agregar `last_sicoes_check_at` en `Company` y re-chequear solo cada N días.

## Migration Plan

1. Instalar `beautifulsoup4` (única nueva dependencia)
2. Crear `src/infrastructure/sicoes/scraper.py`
3. Modificar `src/services/company_service.py`
4. Ejecutar `scripts/sync_sicoes.py` manualmente sobre empresas existentes
5. Sin migraciones de DB necesarias — todos los campos ya existen

**Rollback:** Si el scraper falla en producción, `sicoes_participation` permanece en su valor anterior (False por defecto). No hay riesgo de regresión en otros flows.

## Open Questions

- ¿Cuál es la URL exacta del endpoint de búsqueda de SICOES y qué parámetros acepta? → Requiere inspección manual del sitio antes de implementar. El implementador debe verificar esto primero.
- ¿El sitio requiere cookies de sesión o token CSRF para buscar? → A determinar en la fase de implementación.

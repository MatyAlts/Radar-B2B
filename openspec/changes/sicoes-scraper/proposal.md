## Why

La señal `sicoes_participation` del scoring (vale 20 puntos) no puede calcularse porque el módulo `src/infrastructure/sicoes/` está vacío — el `scraper.py` nunca fue implementado. Sin esta señal, el 20% del score de cada empresa es siempre cero, degradando la calidad del ranking B2B.

## What Changes

- Implementar `SicoesScraper` en `src/infrastructure/sicoes/scraper.py` con un método `check_company_participation(company_name: str) -> bool` que consulta SICOES y retorna si la empresa aparece como adjudicada en procesos de contratación pública.
- Agregar método `enrich_sicoes` en `CompanyService` que, dado una empresa, ejecuta el scraper y actualiza `sicoes_participation` y recalcula el score.
- Agregar script o endpoint para ejecutar el enriquecimiento SICOES sobre todas las empresas de la DB.

## Capabilities

### New Capabilities

- `sicoes-participation-check`: Consulta SICOES por nombre de empresa y determina si tiene participación en licitaciones públicas bolivianas. Devuelve un booleano. Es el building block que activa la señal de scoring.

### Modified Capabilities

- `company-scoring`: El campo `sicoes_participation` en `Company` pasa de ser siempre `False` a ser poblado dinámicamente por el scraper. El cálculo del score y la justificación IA ya existen — solo se necesita que el input sea correcto.

## Impact

- **Nuevo archivo**: `src/infrastructure/sicoes/scraper.py`
- **Modificado**: `src/services/company_service.py` — nuevo método `enrich_sicoes`
- **Modificado**: `src/infrastructure/sicoes/__init__.py` — ya importa `SicoesScraper`, ahora habrá algo real
- **Dependencias**: `httpx` (ya existe), `beautifulsoup4` o `lxml` para parsing HTML de SICOES
- **Sin cambios de schema** en DB — `sicoes_participation` ya existe en `CompanyModel`

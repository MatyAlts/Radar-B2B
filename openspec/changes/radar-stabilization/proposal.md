## Why

La plataforma Radar B2B ha integrado exitosamente la API de Apollo.io, pero presenta errores de estabilidad críticos que impiden su uso efectivo: la paginación no funciona correctamente (mostrando siempre los mismos 10 resultados), el sistema de scoring con IA no se gatilla para las nuevas empresas, y la UI se bloquea en bucles infinitos cuando falta información de justificación o contactos.

## What Changes

- **Paginación Robusta**: Sincronización de los parámetros de paginación entre el frontend (`page`, `page_size`) y el backend (`skip`, `limit`).
- **Trigger de Scoring**: Implementación de un mecanismo para ejecutar el scoring e IA de justificación sobre empresas que aún no han sido procesadas.
- **Resiliencia de UI**: Corrección del estado de carga infinito en la justificación de scoring y manejo de errores 403 (permisos de API) en la lista de contactos.
- **Visualización de Temperatura**: Asegurar que los badges de temperatura se muestren correctamente basados en el score calculado.

## Capabilities

### New Capabilities
- `scoring-trigger`: Capacidad de gatillar el análisis de IA para empresas individuales o lotes desde el dashboard.

### Modified Capabilities
- `radar-company-list`: Actualización para soportar paginación basada en `skip`/`limit` correctamente.
- `company-score-card`: Ajuste para manejar estados de justificación vacíos sin bloquear la UI.
- `contact-enrichment`: Manejo de errores de permisos (403) para informar al usuario sobre las limitaciones de su plan de Apollo.

## Impact

- **Backend**: `src/api/routers/companies.py`, `src/services/company_service.py`.
- **Frontend**: `frontend/lib/api/companies.ts`, `frontend/components/radar/details/JustificationSection.tsx`, `frontend/components/leads/ContactList.tsx`.
- **API**: Cambio en el contrato de parámetros de consulta para `/companies`.

## MODIFIED Requirements

### Requirement: Identificación de decisores por empresa
El sistema SHALL buscar y retornar los contactos clave (decisores) de una empresa usando Apollo.io, filtrando por cargos relevantes.

#### Scenario: Error de permisos de API (403 Forbidden)
- **WHEN** la API de Apollo retorna un error 403 al buscar contactos (debido a limitaciones del plan)
- **THEN** el sistema retorna un error estructurado al frontend indicando "Plan de API insuficiente" y el frontend muestra un mensaje explicativo recomendando contactar al administrador o subir de plan

## MODIFIED Requirements

### Requirement: Paginación del listado
La tabla SHALL soportar paginación con 20 empresas por página por defecto. El backend debe aceptar parámetros `page` (1-indexed) y `page_size` para facilitar la integración con el frontend.

#### Scenario: Navegar a página siguiente
- **WHEN** el usuario hace click en "Siguiente" o en un número de página (ej. página 2)
- **THEN** el frontend envía una petición con `page=2` y `page_size=20`, y el backend retorna los resultados correspondientes (offset 20) manteniendo los filtros activos

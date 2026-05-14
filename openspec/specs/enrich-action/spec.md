## ADDED Requirements

### Requirement: Botón "Buscar decisores" para disparar enriquecimiento
El frontend SHALL mostrar un botón "Buscar decisores" en el tab "Contactos" del drawer de empresa y en la vista de leads de una empresa específica. Al hacer click dispara `POST /api/v1/companies/enrich` con el nombre y dominio de la empresa.

#### Scenario: Click en "Buscar decisores" — éxito
- **WHEN** el usuario hace click en "Buscar decisores"
- **THEN** el botón muestra spinner y texto "Buscando...", se deshabilita para evitar doble click, y al completar invalida la query de contactos para refetch automático

#### Scenario: Enriquecimiento en progreso — polling
- **WHEN** el backend acepta la solicitud (202 Accepted) pero los contactos aún no están disponibles
- **THEN** el frontend hace polling cada 3 segundos a `GET /api/v1/companies/{id}/contacts` hasta detectar nuevos contactos o que pasen 30 segundos

#### Scenario: Enriquecimiento completado — nuevos contactos
- **WHEN** el polling detecta que `contacts.length` aumentó respecto al valor anterior
- **THEN** se detiene el polling, se muestra toast "Se encontraron X nuevos decisores", y la lista de contactos se actualiza

#### Scenario: Enriquecimiento sin resultados
- **WHEN** el polling termina (30 segundos) y no hay nuevos contactos
- **THEN** se muestra toast "No se encontraron nuevos decisores en Apollo para esta empresa"

#### Scenario: Error en el enriquecimiento
- **WHEN** el backend retorna error 4xx o 5xx
- **THEN** el botón vuelve a estado habilitado y se muestra toast de error "Error al buscar decisores, intentá de nuevo"

### Requirement: Estado del botón según disponibilidad de datos de empresa
El botón "Buscar decisores" SHALL estar disponible solo cuando la empresa tiene al menos nombre. Si la empresa no tiene dominio, se muestra igual pero el enriquecimiento puede ser menos preciso.

#### Scenario: Empresa sin nombre
- **WHEN** la empresa no tiene nombre en la base de datos
- **THEN** el botón "Buscar decisores" no se renderiza

#### Scenario: Empresa ya enriquecida recientemente
- **WHEN** la empresa tiene `apollo_enriched: true` y `last_enriched_at` es menor a 24 horas
- **THEN** el botón muestra tooltip "Enriquecido hace X horas" y se renderiza como secundario (no prominente), pero sigue siendo clickeable

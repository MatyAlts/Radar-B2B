## ADDED Requirements

### Requirement: Panel de filtros con sincronización de URL
La pantalla SHALL mostrar un panel de filtros que permita filtrar el listado de empresas. Todos los filtros activos SHALL estar reflejados en los search params de la URL para permitir compartir búsquedas.

Filtros disponibles:
- **Sector**: select múltiple (industria, logística, agro, minería, almacenamiento, otros)
- **Temperatura**: radio buttons (Todos, Caliente, Tibio, Frío)
- **Búsqueda por nombre**: input de texto con debounce de 300ms
- **Rango de score**: slider dual (0-100)

#### Scenario: Aplicar filtro de temperatura
- **WHEN** el usuario selecciona "Caliente" en el filtro de temperatura
- **THEN** la URL se actualiza a `?temperature=caliente`, el listado se recarga mostrando solo empresas con score ≥ 70, y el filtro queda visualmente activo

#### Scenario: URL compartida con filtros
- **WHEN** el usuario accede a `/?temperature=caliente&industry=logistica`
- **THEN** los filtros correspondientes aparecen seleccionados en el panel y el listado muestra resultados filtrados

#### Scenario: Búsqueda por nombre con debounce
- **WHEN** el usuario escribe en el campo de búsqueda
- **THEN** el listado se actualiza 300ms después de que el usuario deja de escribir (no en cada keystroke)

### Requirement: Contador y reset de filtros activos
El panel SHALL mostrar cuántos filtros están activos y un botón para limpiarlos todos de una vez.

#### Scenario: Mostrar contador de filtros
- **WHEN** el usuario tiene 2 o más filtros activos
- **THEN** aparece un badge con el número de filtros activos y un botón "Limpiar filtros"

#### Scenario: Limpiar todos los filtros
- **WHEN** el usuario hace click en "Limpiar filtros"
- **THEN** todos los filtros se resetean, la URL pierde los search params de filtros, y el listado vuelve al estado inicial (todas las empresas, orden por score desc)

#### Scenario: Sin filtros activos
- **WHEN** no hay ningún filtro aplicado
- **THEN** el botón "Limpiar filtros" no se muestra

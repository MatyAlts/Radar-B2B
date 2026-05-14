## ADDED Requirements

### Requirement: Listado de empresas ordenado por score
La pantalla principal SHALL mostrar una tabla de empresas ordenadas por score descendente (mayor prioridad arriba). Cada fila incluye: nombre, sector, ciudad, score (0-100), temperatura, señales activas (íconos), y fecha de última actualización.

#### Scenario: Carga inicial del listado
- **WHEN** el usuario navega a `/`
- **THEN** la tabla muestra las primeras 20 empresas ordenadas por score desc, con skeleton loaders mientras carga

#### Scenario: Datos cargados
- **WHEN** la API responde con la lista de empresas
- **THEN** cada fila muestra: nombre de empresa, sector, ciudad, score numérico, badge de temperatura, íconos de señales activas

#### Scenario: Sin empresas
- **WHEN** la API retorna lista vacía (con filtros aplicados o sin datos)
- **THEN** se muestra un estado vacío con mensaje "No se encontraron empresas con los filtros aplicados"

#### Scenario: Error de API
- **WHEN** la API retorna error o no está disponible
- **THEN** se muestra un mensaje de error con botón "Reintentar" que vuelve a ejecutar la query

### Requirement: Paginación del listado
La tabla SHALL soportar paginación con 20 empresas por página por defecto. La navegación entre páginas no debe resetear los filtros activos.

#### Scenario: Navegar a página siguiente
- **WHEN** el usuario hace click en "Siguiente" o en un número de página
- **THEN** la tabla muestra el siguiente bloque de empresas manteniendo los filtros activos, sin flash de contenido (keepPreviousData)

#### Scenario: Página fuera de rango
- **WHEN** el usuario accede a una URL con un número de página mayor al total disponible
- **THEN** se redirige a la última página disponible

### Requirement: Ordenamiento de columnas
La tabla SHALL permitir ordenar por columnas: score (default desc), nombre (asc/desc), sector (asc/desc).

#### Scenario: Cambiar ordenamiento
- **WHEN** el usuario hace click en el header de una columna ordenable
- **THEN** la tabla se reordena por esa columna, el header muestra el indicador de dirección (↑/↓), y la URL se actualiza con `order_by` y `order`

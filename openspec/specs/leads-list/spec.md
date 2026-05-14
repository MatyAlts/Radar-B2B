## ADDED Requirements

### Requirement: Listado consolidado de decisores en /leads
La ruta `/leads` SHALL mostrar todos los contactos (decisores) de todas las empresas en una tabla paginada. Cada fila incluye: nombre del contacto, cargo, empresa, email, LinkedIn, teléfono, confiabilidad.

#### Scenario: Carga inicial de leads
- **WHEN** el usuario navega a `/leads`
- **THEN** la tabla muestra los primeros 20 contactos con skeleton loaders mientras carga, ordenados por nombre de empresa ascendente

#### Scenario: Datos cargados
- **WHEN** la API responde con la lista de contactos
- **THEN** cada fila muestra: nombre, cargo con badge, empresa (clickeable al radar de esa empresa), email, ícono LinkedIn (link externo), teléfono, badge de confiabilidad (high/medium/low)

#### Scenario: Sin contactos disponibles
- **WHEN** no hay contactos en la base de datos (empresas sin enriquecer)
- **THEN** se muestra estado vacío: "Todavía no hay decisores. Enriquecé una empresa desde el Radar para encontrar contactos."

### Requirement: Filtros de leads con URL sync
La pantalla `/leads` SHALL tener filtros sincronizados con URL: por empresa (select), por cargo (input texto), y por confiabilidad (radio: Todos / Alta / Media / Baja).

#### Scenario: Filtrar por empresa
- **WHEN** el usuario selecciona una empresa en el select
- **THEN** la URL se actualiza con `?company=<id>`, la tabla muestra solo contactos de esa empresa

#### Scenario: Filtrar por cargo
- **WHEN** el usuario escribe "gerente" en el filtro de cargo
- **THEN** la tabla muestra solo contactos cuyo cargo contiene "gerente" (case-insensitive), con debounce de 300ms

#### Scenario: Filtrar por confiabilidad
- **WHEN** el usuario selecciona "Alta"
- **THEN** la tabla muestra solo contactos con `reliability = "high"`

### Requirement: Paginación de leads
La tabla de leads SHALL soportar paginación de 20 registros por página, manteniendo los filtros activos al cambiar de página.

#### Scenario: Navegar entre páginas
- **WHEN** el usuario hace click en una página diferente
- **THEN** la tabla actualiza su contenido sin resetear los filtros activos, usando `keepPreviousData` para evitar flash

### Requirement: Tab "Contactos" en el drawer de empresa del Radar
El drawer de detalle de empresa (en `/`) SHALL tener un tab "Contactos" que muestra los decisores de esa empresa específica, usando el mismo componente `ContactList`.

#### Scenario: Ver contactos desde el Radar
- **WHEN** el usuario abre el drawer de una empresa y hace click en el tab "Contactos"
- **THEN** se muestran los contactos de esa empresa: nombre, cargo, email, LinkedIn, teléfono, confiabilidad

#### Scenario: Empresa sin contactos enriquecidos
- **WHEN** la empresa no tiene contactos en la base de datos
- **THEN** el tab "Contactos" muestra: "No se encontraron decisores. Hacé click en 'Buscar decisores' para iniciar el enriquecimiento."

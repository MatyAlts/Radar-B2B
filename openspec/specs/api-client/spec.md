## ADDED Requirements

### Requirement: Cliente HTTP tipado para la API del backend
El frontend SHALL tener un cliente HTTP centralizado (`lib/api/`) que encapsule todas las llamadas al backend con tipos TypeScript y manejo de errores estandarizado.

#### Scenario: Request exitoso a companies
- **WHEN** se llama `api.companies.list({ page: 1, limit: 20, temperature: "caliente" })`
- **THEN** retorna un objeto tipado `PaginatedResponse<Company>` con los datos de la API

#### Scenario: Error de red
- **WHEN** el backend no está disponible o retorna error 5xx
- **THEN** el cliente lanza una excepción tipada `ApiError` con `status`, `code` y `message`, que TanStack Query convierte en estado de error

#### Scenario: Error de validación (422)
- **WHEN** el backend retorna 422 por parámetros inválidos
- **THEN** el cliente lanza `ApiError` con los detalles de validación accesibles para mostrar en la UI

### Requirement: Modo mock para desarrollo sin backend
El cliente SHALL soportar un modo mock activado por variable de entorno (`NEXT_PUBLIC_API_MOCK=true`) que retorna datos ficticios sin hacer requests reales.

#### Scenario: Modo mock activado
- **WHEN** `NEXT_PUBLIC_API_MOCK=true` y se llama cualquier función del cliente
- **THEN** retorna datos mock tipados idénticos a los de la API real, con un delay simulado de 500ms

#### Scenario: Modo mock desactivado
- **WHEN** `NEXT_PUBLIC_API_MOCK` no está definido o es `false`
- **THEN** el cliente hace requests reales a `NEXT_PUBLIC_API_URL`

### Requirement: Tipos TypeScript de respuesta
El cliente SHALL exportar tipos TypeScript para todas las entidades de la API: `Company`, `Contact`, `Signal`, `Tender`, `PaginatedResponse<T>`, `ApiError`.

#### Scenario: Tipos disponibles para uso en componentes
- **WHEN** un componente importa `Company` desde `@/lib/api/types`
- **THEN** TypeScript infiere correctamente todos los campos: id, name, industry, city, score, temperature, signals (con cada señal booleana), score_justification

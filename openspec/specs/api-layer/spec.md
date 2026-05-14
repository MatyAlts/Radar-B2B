## ADDED Requirements

### Requirement: API REST con versionado
El sistema SHALL exponer todos los endpoints bajo el prefijo `/api/v1/`. La documentación OpenAPI SHALL estar disponible en `/docs` y `/redoc`.

#### Scenario: Documentación disponible
- **WHEN** se accede a `GET /docs`
- **THEN** el sistema retorna la UI de Swagger con todos los endpoints documentados

#### Scenario: Health check
- **WHEN** se llama `GET /api/v1/health`
- **THEN** retorna `{"status": "ok", "database": "connected", "version": "1.0.0"}` con status 200

### Requirement: Manejo de errores estandarizado
El sistema SHALL retornar errores con formato consistente: `{"error": "<code>", "message": "<descripción>", "detail": <opcional>}`.

#### Scenario: Recurso no encontrado
- **WHEN** se solicita una empresa que no existe (`GET /api/v1/companies/999`)
- **THEN** retorna status 404 con `{"error": "not_found", "message": "Company 999 not found"}`

#### Scenario: Error de validación
- **WHEN** se envía un payload con campos inválidos
- **THEN** retorna status 422 con detalle de los campos que fallaron la validación

#### Scenario: Error interno
- **WHEN** ocurre un error inesperado en el servidor
- **THEN** retorna status 500 con `{"error": "internal_error", "message": "An unexpected error occurred"}` sin exponer stack traces

### Requirement: CORS configurado para desarrollo
El sistema SHALL tener CORS configurado para permitir requests desde `http://localhost:3000` (frontend en desarrollo).

#### Scenario: Request desde frontend local
- **WHEN** el frontend en `localhost:3000` hace un request a la API
- **THEN** el servidor incluye los headers CORS correctos y no bloquea el request

### Requirement: Paginación estándar
Todos los endpoints de listado SHALL soportar parámetros `page` (default: 1) y `limit` (default: 20, max: 100). La respuesta SHALL incluir `{"items": [...], "total": N, "page": N, "pages": N}`.

#### Scenario: Paginación válida
- **WHEN** se llama con `?page=2&limit=10`
- **THEN** retorna los items del rango correspondiente con metadata de paginación correcta

#### Scenario: Límite excedido
- **WHEN** se solicita `?limit=200`
- **THEN** retorna error 422 indicando que el máximo es 100

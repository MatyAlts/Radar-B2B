## ADDED Requirements

### Requirement: Identificación de decisores por empresa
El sistema SHALL buscar y retornar los contactos clave (decisores) de una empresa usando Apollo.io, filtrando por cargos relevantes: Gerente General, Dueño, Jefe de Compras, Gerente de Operaciones, Director, CEO, CFO.

#### Scenario: Búsqueda exitosa de decisores
- **WHEN** se llama `GET /api/v1/companies/{company_id}/contacts`
- **THEN** retorna lista de contactos con: nombre, cargo, email (si disponible), linkedin_url, teléfono (si disponible), confiabilidad del dato (high/medium/low)

#### Scenario: Sin decisores encontrados
- **WHEN** Apollo no retorna contactos con cargos relevantes para la empresa
- **THEN** retorna lista vacía y marca la empresa con `decision_maker_found: false`

### Requirement: Persistencia y actualización de contactos
El sistema SHALL persistir los contactos encontrados en PostgreSQL y evitar duplicados por empresa + email.

#### Scenario: Contacto nuevo
- **WHEN** se enriquece una empresa y Apollo retorna un contacto no existente
- **THEN** el sistema crea el registro en la tabla `contacts` asociado a la empresa

#### Scenario: Contacto ya existente
- **WHEN** el contacto (mismo email + misma empresa) ya existe en la base de datos
- **THEN** el sistema actualiza los campos (cargo, teléfono) y actualiza `last_updated_at`, sin crear duplicado

### Requirement: Score de decisor encontrado
El sistema SHALL actualizar el score de la empresa (+15) cuando al menos un decisor con cargo relevante es encontrado.

#### Scenario: Decisor encontrado impacta el score
- **WHEN** se detecta al menos un contacto con cargo relevante para una empresa
- **THEN** el campo `decision_maker_found` de la empresa pasa a `true` y se recalcula el score sumando los 15 puntos correspondientes

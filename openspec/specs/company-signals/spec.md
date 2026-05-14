## ADDED Requirements

### Requirement: Registro de señales de compra
El sistema SHALL registrar señales de compra asociadas a empresas. Cada señal tiene: tipo, fuente, descripción, fecha de detección, y nivel de relevancia.

Tipos de señales:
- `licitacion_activa`: empresa convocante en SICOES
- `adjudicacion_reciente`: empresa adjudicada en SICOES
- `crecimiento_empleados`: crecimiento detectado vía Apollo
- `expansion_geografica`: nueva sede o ciudad detectada

#### Scenario: Señal registrada correctamente
- **WHEN** se detecta una licitación donde una empresa es convocante
- **THEN** se crea una señal tipo `licitacion_activa` asociada a la empresa con fuente `SICOES`, descripción del proceso y fecha de publicación

#### Scenario: Señal duplicada ignorada
- **WHEN** se intenta registrar la misma señal (mismo tipo + misma fuente_id) que ya existe
- **THEN** el sistema actualiza la fecha de última detección sin crear duplicado

### Requirement: Consulta de señales por empresa
El sistema SHALL exponer un endpoint para listar las señales de una empresa, ordenadas por fecha descendente.

#### Scenario: Consulta de señales
- **WHEN** se llama `GET /api/v1/companies/{company_id}/signals`
- **THEN** retorna lista de señales con: id, tipo, fuente, descripción, relevancia, detectada_en

#### Scenario: Señales vacías
- **WHEN** la empresa no tiene señales registradas
- **THEN** retorna lista vacía con status 200

### Requirement: Activación de señal de compra en score
El sistema SHALL marcar `purchase_signal=true` en la empresa cuando existe al menos una señal de alta relevancia.

#### Scenario: Señal de alta relevancia activa el flag
- **WHEN** se registra una señal con relevancia `alta` (licitacion_activa, adjudicacion_reciente)
- **THEN** `purchase_signal` de la empresa pasa a `true` y se dispara el recálculo del score

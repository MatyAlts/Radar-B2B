## ADDED Requirements

### Requirement: Ingesta de licitaciones desde SICOES
El sistema SHALL extraer procesos de contratación pública del portal SICOES Bolivia mediante scraping, y persistirlos en PostgreSQL con datos normalizados.

#### Scenario: Scraping exitoso de licitaciones
- **WHEN** el job de ingesta SICOES se ejecuta
- **THEN** el sistema extrae convocatorias activas con campos: número de proceso, entidad convocante, objeto del contrato, monto estimado, fecha publicación, fecha límite, estado

#### Scenario: SICOES no disponible
- **WHEN** el portal SICOES retorna error o timeout
- **THEN** el job registra el error en logs, no falla silenciosamente, y reintenta en la próxima ejecución programada

#### Scenario: Datos ya existentes
- **WHEN** el scraper encuentra un proceso que ya existe en la base de datos (mismo número de proceso)
- **THEN** actualiza el estado y fecha de última actualización sin crear duplicado

### Requirement: Cruce empresa-licitación
El sistema SHALL relacionar empresas del radar con licitaciones donde participaron o fueron adjudicadas, usando fuzzy matching de nombre de empresa.

#### Scenario: Empresa encontrada en licitación
- **WHEN** el nombre de una empresa del radar aparece (con ≥80% de similitud) en los datos de participantes de una licitación SICOES
- **THEN** se crea la relación `company_sicoes_process` y el campo `sicoes_participation` de la empresa pasa a `true`

#### Scenario: Adjudicación detectada
- **WHEN** una empresa fue adjudicada en una licitación
- **THEN** se marca la señal como `adjudicada` con mayor peso en el scoring

### Requirement: API de consulta de licitaciones
El sistema SHALL exponer un endpoint para consultar licitaciones asociadas a una empresa.

#### Scenario: Consulta de licitaciones por empresa
- **WHEN** se llama `GET /api/v1/companies/{company_id}/tenders`
- **THEN** retorna lista de licitaciones relacionadas con: número de proceso, entidad, objeto, monto, estado, tipo de participación (participante/adjudicado)

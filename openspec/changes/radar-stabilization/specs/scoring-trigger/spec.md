## ADDED Requirements

### Requirement: Gatillo de Scoring Manual
El sistema SHALL permitir gatillar el proceso de scoring e IA de justificación para una empresa específica desde la interfaz de detalle.

#### Scenario: Gatillar scoring exitoso
- **WHEN** el usuario hace click en "Analizar con IA" en una empresa sin justificación
- **THEN** el sistema inicia el proceso de análisis, muestra un estado de carga y actualiza el score y la justificación al finalizar

### Requirement: Scoring Automático post-Enriquecimiento
El sistema SHALL ejecutar automáticamente el motor de scoring después de un enriquecimiento exitoso desde Apollo.io.

#### Scenario: Enriquecimiento gatilla scoring
- **WHEN** una empresa es enriquecida con nuevos datos de Apollo
- **THEN** el sistema recalcula el score basándose en los nuevos datos y actualiza la justificación

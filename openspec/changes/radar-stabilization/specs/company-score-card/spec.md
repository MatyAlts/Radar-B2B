## MODIFIED Requirements

### Requirement: Panel de detalle de empresa (expandible)
Al hacer click en una fila de empresa, SHALL mostrarse un panel lateral (drawer) con información extendida: descripción, justificación IA del score, breakdown de señales con puntos, y botones de acción.

#### Scenario: Justificación IA no disponible
- **WHEN** `score_justification` es null en la respuesta de la API y no hay un proceso de generación activo
- **THEN** el panel muestra un estado "Análisis pendiente" con un botón "Analizar con IA" para disparar el proceso manualmente

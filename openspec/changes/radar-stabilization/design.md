## Context

El sistema actual sufre de una desconexión entre el frontend (Next.js) y el backend (FastAPI) en cuanto a paginación, y carece de un flujo resiliente para el scoring por IA de empresas importadas masivamente desde Apollo.io. Además, las restricciones del plan de API de Apollo no están siendo manejadas con elegancia en la interfaz.

## Goals / Non-Goals

**Goals:**
- Unificar el contrato de paginación entre todas las capas.
- Implementar el gatillo manual/automático de scoring para empresas.
- Eliminar estados de carga infinitos en la UI.
- Proporcionar feedback claro sobre errores de API (específicamente 403).

**Non-Goals:**
- Re-diseñar el motor de scoring (solo se busca gatillarlo correctamente).
- Implementar búsqueda de contactos alternativa a Apollo.

## Decisions

### 1. Estandarización de Paginación
**Decisión:** El backend ahora aceptará `page` y `page_size` directamente en los routers, traduciéndolos a `skip` y `limit` antes de pasar a la capa de servicio/repo.
**Razonamiento:** El frontend de Next.js ya usa `page` de forma natural. Es más limpio manejar la aritmética de offsets en el controlador del backend que obligar al frontend a calcular skips.
**Alternativa:** Forzar al frontend a enviar `skip`/`limit`. Descartado por ser menos intuitivo para el desarrollo de UI.

### 2. Gatillo de Scoring con IA
**Decisión:** Crear un endpoint `POST /api/v1/companies/{id}/enrich` (o extenderlo) que no solo busque datos en Apollo, sino que gatille el `ScoringService`.
**Razonamiento:** Aprovechamos el flujo de enriquecimiento existente para consolidar la "activación" de una empresa.
**Implementación:** El servicio verificará si la empresa tiene `signals`. Si no, intentará generarlas (SICOES/Noticias) y luego llamará a la IA para el score final.

### 3. Manejo de Justificación en UI
**Decisión:** Si `score_justification` es `null`, mostrar un estado "Análisis pendiente" con un botón de acción en lugar de un skeleton infinito.
**Razonamiento:** Mejora la UX al dar control al usuario sobre cuándo gastar tokens de IA.

### 4. Resiliencia ante 403 Forbidden
**Decisión:** Capturar el error 403 en `useContacts` y mapearlo a un mensaje específico: "Tu plan de Apollo no permite la búsqueda de contactos por API".
**Razonamiento:** Evita la confusión del usuario entre un error de sistema y una limitación de cuenta.

## Risks / Trade-offs

- **[Riesgo] Consumo de tokens**: Gatillar scoring masivo puede ser costoso. → **Mitigación**: Implementar el scoring de forma individual por demanda o en lotes controlados.
- **[Trade-off] Complejidad en routers**: Agregar lógica de traducción de paginación ensucia un poco los endpoints. → **Mitigación**: Usar una función helper para la conversión.

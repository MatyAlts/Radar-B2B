## 1. Backend: Estabilización de API y Paginación

- [x] 1.1 Actualizar `CompanyListParams` y router de empresas para aceptar `page` y `page_size`.
- [x] 1.2 Implementar lógica de traducción de `page` a `skip` en el router o servicio.
- [x] 1.3 Asegurar que el total de páginas (`total_pages`) se calcule y retorne correctamente.

## 2. Backend: Motor de Scoring y Gatillos

- [x] 2.1 Refactorizar `CompanyService.enrich_company` para que gatille automáticamente el scoring después de traer datos de Apollo.
- [x] 2.2 Crear endpoint explícito `POST /api/v1/companies/{id}/score` para re-calcular score y justificación a demanda.
- [x] 2.3 Asegurar que el scoring asigne la temperatura correcta ("caliente", "tibio", "frío") en español.

## 3. Frontend: Resiliencia de UI y Justificación

- [x] 3.1 Actualizar `JustificationSection.tsx` para manejar `justification === null` con un estado de "Pendiente" y botón de "Analizar".
- [x] 3.2 Implementar la llamada al nuevo endpoint de scoring desde el botón "Analizar".
- [x] 3.3 Corregir la visualización de scores y temperaturas en la tabla principal.

## 4. Frontend: Manejo de Errores de Apollo (403)

- [x] 4.1 Actualizar el hook `useContacts` para detectar el error 403 y devolver un mensaje de error amigable.
- [x] 4.2 Ajustar `ContactList.tsx` para mostrar una alerta informativa cuando el plan de Apollo no permite la búsqueda de personas.

## 5. Verificación Final

- [x] 5.1 Verificar navegación entre páginas en el Dashboard.
- [x] 5.2 Verificar que una empresa recién sincronizada pase de score 0 a >0 tras gatillar el análisis.
- [x] 5.3 Validar que el Drawer de detalle ya no se quede en "Generando..." infinitamente.

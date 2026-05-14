## 1. Scaffolding del proyecto frontend

- [ ] 1.1 Crear proyecto Next.js 15 en `frontend/` con `create-next-app` (TypeScript, App Router, Tailwind CSS, ESLint)
- [ ] 1.2 Instalar dependencias: `@tanstack/react-query`, `zustand`, `nuqs`, `lucide-react`, `clsx`, `tailwind-merge`
- [ ] 1.3 Inicializar shadcn/ui y agregar componentes base: `button`, `badge`, `table`, `drawer`, `input`, `select`, `slider`, `skeleton`, `tooltip`
- [ ] 1.4 Crear `.env.local` con `NEXT_PUBLIC_API_URL=http://localhost:8000` y `NEXT_PUBLIC_API_MOCK=true`
- [ ] 1.5 Configurar `app/layout.tsx` con `QueryClientProvider` (TanStack Query) y `NuqsAdapter`
- [ ] 1.6 Configurar Vitest + `@testing-library/react` + `@testing-library/user-event` para tests de componentes

## 2. Cliente API y tipos TypeScript

- [ ] 2.1 Crear `lib/api/types.ts` con interfaces: `Company`, `CompanySignals`, `Contact`, `Signal`, `Tender`, `PaginatedResponse<T>`, `ApiError`, `CompanyListParams`
- [ ] 2.2 Crear `lib/api/client.ts`: función base `apiFetch` con manejo de errores tipado (lanza `ApiError` en 4xx/5xx)
- [ ] 2.3 Crear `lib/api/companies.ts`: función `listCompanies(params: CompanyListParams): Promise<PaginatedResponse<Company>>`
- [ ] 2.4 Crear `lib/api/mock.ts`: datos mock con 15-20 empresas ficticias bolivianas con variedad de scores, sectores y señales
- [ ] 2.5 Integrar mock: cuando `NEXT_PUBLIC_API_MOCK=true`, `listCompanies` retorna mock data con delay de 500ms
- [ ] 2.6 Escribir tests unitarios para el cliente: error handling 404, 422, 500, y modo mock

## 3. Store de filtros con Zustand + URL sync

- [ ] 3.1 Crear `lib/store/radar-filters.ts`: store Zustand con estado `{ industry[], temperature, query, scoreRange, page, orderBy, order }` y actions `setFilter`, `resetFilters`, `setPage`
- [ ] 3.2 Implementar sincronización bidireccional con URL params usando `nuqs`: leer filtros de URL al montar, actualizar URL al cambiar filtros
- [ ] 3.3 Crear hook `useRadarFilters()` que expone el estado y las acciones del store
- [ ] 3.4 Crear hook `useCompanies()` que usa TanStack Query con `keepPreviousData: true` y los filtros del store como `queryKey`
- [ ] 3.5 Escribir tests para el store: aplicar filtros, resetear, cambiar página

## 4. Componentes de visualización de score y señales

- [ ] 4.1 Crear `components/radar/ScoreBadge.tsx`: badge con score numérico y color por temperatura (rojo ≥70, amarillo 40-69, gris <40)
- [ ] 4.2 Crear `components/radar/TemperatureBadge.tsx`: badge "Caliente" / "Tibio" / "Frío" con ícono y color correspondiente
- [ ] 4.3 Crear `components/radar/SignalsDisplay.tsx`: fila de íconos Lucide para señales activas, con tooltip al hover
- [ ] 4.4 Escribir tests para `ScoreBadge`: score 100 → caliente, score 50 → tibio, score 20 → frío
- [ ] 4.5 Escribir tests para `SignalsDisplay`: 3 señales activas → 3 íconos, 0 señales → sin íconos

## 5. Tabla de empresas con paginación y ordenamiento

- [ ] 5.1 Crear `components/radar/CompanyTable.tsx`: tabla con columnas nombre, sector, ciudad, score, temperatura, señales, última actualización
- [ ] 5.2 Implementar headers ordenables (score, nombre, sector) con íconos de dirección y actualización de URL params
- [ ] 5.3 Implementar skeleton loaders para el estado de carga (10 filas de skeleton)
- [ ] 5.4 Implementar estado vacío: mensaje + ícono cuando `total === 0`
- [ ] 5.5 Implementar estado de error: mensaje + botón "Reintentar" que llama a `refetch()`
- [ ] 5.6 Crear `components/radar/Pagination.tsx`: controles de página anterior/siguiente + números de página, deshabilitados en los extremos
- [ ] 5.7 Escribir tests para `CompanyTable`: renderiza skeleton en loading, muestra empresas en éxito, muestra error state

## 6. Panel de filtros

- [ ] 6.1 Crear `components/radar/FilterPanel.tsx`: panel lateral o superior con todos los filtros
- [ ] 6.2 Implementar filtro de temperatura: radio buttons (Todos / Caliente / Tibio / Frío)
- [ ] 6.3 Implementar filtro de sector: multi-select con los 5 sectores + "Otros"
- [ ] 6.4 Implementar búsqueda por nombre: input con debounce de 300ms (usar `useDebounce` hook)
- [ ] 6.5 Implementar badge contador de filtros activos y botón "Limpiar filtros" (visible solo cuando hay filtros)
- [ ] 6.6 Escribir tests: aplicar filtro temperatura → URL cambia, click "Limpiar" → filtros reseteados

## 7. Panel de detalle de empresa (Drawer)

- [ ] 7.1 Crear `components/radar/CompanyDetailDrawer.tsx`: drawer lateral con información extendida de la empresa seleccionada
- [ ] 7.2 Implementar breakdown de señales: lista de todas las señales con estado (activa/inactiva) y puntos correspondientes
- [ ] 7.3 Implementar sección de justificación IA: texto cuando disponible, spinner + "Generando justificación..." cuando `score_justification === null`
- [ ] 7.4 Integrar apertura/cierre del drawer con click en fila de la tabla, sincronizado con URL param `?company=<id>`
- [ ] 7.5 Escribir tests: drawer abre al click en fila, muestra spinner cuando justification es null, cierra al click fuera

## 8. Página principal e integración final

- [ ] 8.1 Crear `app/page.tsx`: layout de dos columnas (panel de filtros izquierda, tabla derecha) o layout de filtros arriba + tabla
- [ ] 8.2 Integrar `FilterPanel` + `CompanyTable` + `CompanyDetailDrawer` + `Pagination` en la página
- [ ] 8.3 Conectar `useCompanies()` con los filtros del store — verificar que cambios de filtros disparan refetch
- [ ] 8.4 Cambiar `NEXT_PUBLIC_API_MOCK=false` y probar integración con backend real (cuando esté disponible)
- [ ] 8.5 Verificar que la URL refleja filtros correctamente y que recargar la página restaura el estado

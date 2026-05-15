## 1. Infraestructura de Diseño (Tailwind v4)

- [x] 1.1 Expandir `frontend/app/globals.css` con el sistema de tokens OKLCH completo.
- [x] 1.2 Refactorizar `frontend/components/ui/button.tsx` usando CVA y los nuevos tokens.
- [x] 1.3 Refactorizar `frontend/components/ui/input.tsx` y `label.tsx`.
- [x] 1.4 Crear `frontend/components/ui/card.tsx` y `badge.tsx` siguiendo el patrón v4.

## 2. Sistema de Ayuda y Layout

- [x] 2.1 Crear `frontend/components/ui/HelpButton.tsx`.
- [x] 2.2 Inicializar `frontend/lib/utils/helpContent.tsx` con el contenido del Radar.
- [x] 2.3 Crear `frontend/components/layout/PageContainer.tsx` que integre el `HelpButton`.

## 3. Hooks de CRUD y Paginación

- [x] 3.1 Implementar `frontend/lib/hooks/useFormModal.ts`.
- [x] 3.2 Implementar `frontend/lib/hooks/useConfirmDialog.ts`.
- [x] 3.3 Implementar `frontend/lib/hooks/usePagination.ts`.

## 4. Refactor de Página Radar

- [x] 4.1 Migrar `frontend/app/page.tsx` para usar `PageContainer` y los nuevos hooks.
- [x] 4.2 Asegurar que el Drawer de detalle use el nuevo `HelpButton` interno.
- [x] 4.3 Actualizar `CompanyTable` para usar el componente `Badge` estandarizado.

## 5. Testing (Playwright)

- [x] 5.1 Instalar y configurar Playwright en el proyecto.
- [x] 5.2 Implementar POM para `RadarPage`.
- [x] 5.3 Crear test `frontend/tests/e2e/radar.spec.ts` que valide el flujo de navegación y detalle.

## 6. Verificación Final

- [x] 6.1 Validar accesibilidad (aria-labels, roles) en los nuevos componentes.
- [x] 6.2 Verificar que el diseño sea responsivo y use los colores correctos de OKLCH.

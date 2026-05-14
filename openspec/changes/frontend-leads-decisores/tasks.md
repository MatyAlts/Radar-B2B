## 1. Ampliación del cliente API

- [ ] 1.1 Agregar tipos a `lib/api/types.ts`: `ContactReliability = "high" | "medium" | "low"` y `Contact` (id, company_id, name, title, email?, linkedin_url?, phone?, reliability, last_updated_at)
- [ ] 1.2 Crear `lib/api/contacts.ts`: función `listContacts(companyId: string): Promise<Contact[]>` consumiendo `GET /api/v1/companies/{id}/contacts`
- [ ] 1.3 Agregar `enrichCompany(companyId: string): Promise<void>` en `lib/api/companies.ts` usando `POST /api/v1/companies/enrich`
- [ ] 1.4 Agregar mock data de contactos en `lib/api/mock.ts`: 2-4 contactos ficticios para al menos 3 empresas mock, con variedad de cargos bolivianos y confiabilidades
- [ ] 1.5 Escribir tests unitarios: `listContacts` retorna array tipado, `listContacts` retorna `[]` cuando no hay contactos, `enrichCompany` lanza `ApiError` en 404

## 2. Store de filtros para /leads

- [ ] 2.1 Crear `lib/store/leads-filters.ts`: store Zustand con estado `{ companyId, titleQuery, reliability, page }` y actions `setFilter`, `resetFilters`, `setPage`
- [ ] 2.2 Implementar sincronización con URL params via `nuqs`: `?company=`, `?title=`, `?reliability=`, `?page=`
- [ ] 2.3 Crear hook `useLeadsFilters()` que expone estado y actions del store
- [ ] 2.4 Crear hook `useContacts(companyId?: string)` con TanStack Query: `keepPreviousData: true`, `queryKey: ["contacts", companyId, filters]`
- [ ] 2.5 Escribir tests para el store: filtrar por empresa actualiza URL, reset limpia todos los filtros

## 3. Componente ContactCard

- [ ] 3.1 Crear `components/leads/ContactCard.tsx`: tarjeta con nombre, badge de cargo por nivel (C-Level azul / Manager verde / Otro gris), badge de confiabilidad color-coded
- [ ] 3.2 Implementar email copiable: `navigator.clipboard.writeText()` con fallback a `execCommand('copy')`
- [ ] 3.3 Integrar `Sonner` (shadcn/ui toast) para feedback: "Email copiado" en éxito, mensaje de error con email visible en fallo
- [ ] 3.4 Implementar botón LinkedIn: link externo con `target="_blank" rel="noopener noreferrer"`, ícono Lucide `Linkedin`
- [ ] 3.5 Implementar display de teléfono: ícono `Phone` de Lucide, texto del número
- [ ] 3.6 Escribir tests: badge C-Level para "Gerente General", badge Manager para "Jefe de Compras", campos opcionales no renderizan cuando son undefined

## 4. Componente ContactList (compartido)

- [ ] 4.1 Crear `components/leads/ContactList.tsx`: lista de `ContactCard` con props `companyId?: string`; si `companyId` viene filtra por empresa, si no muestra todos
- [ ] 4.2 Implementar skeleton loaders: 5 placeholders animados durante carga
- [ ] 4.3 Implementar estado vacío: mensaje contextual según si hay `companyId` o no
- [ ] 4.4 Implementar estado de error con botón "Reintentar"
- [ ] 4.5 Escribir tests: renderiza skeletons en loading, renderiza `ContactCard` por cada contacto, muestra estado vacío cuando `contacts.length === 0`

## 5. Botón de enriquecimiento (EnrichAction)

- [ ] 5.1 Crear `components/leads/EnrichAction.tsx`: botón "Buscar decisores" con `useMutation` de TanStack Query, spinner y estado "Buscando..." mientras corre
- [ ] 5.2 Implementar polling post-enriquecimiento: refetch de contacts cada 3s hasta detectar nuevos contactos o timeout de 30s
- [ ] 5.3 Mostrar toast de resultado: "Se encontraron X nuevos decisores" en éxito, "No se encontraron nuevos decisores" en timeout, toast de error en fallo
- [ ] 5.4 Lógica de visibilidad: no renderizar si empresa sin nombre; renderizar como botón secundario con tooltip si `apollo_enriched` y `last_enriched_at` < 24h
- [ ] 5.5 Escribir tests: botón se deshabilita durante mutation, toast de éxito aparece con count correcto, botón no renderiza si empresa sin nombre

## 6. Tab "Contactos" en el drawer del Radar

- [ ] 6.1 Instalar/inicializar componente `Tabs` de shadcn/ui si no está disponible
- [ ] 6.2 Modificar `components/radar/CompanyDetailDrawer.tsx`: agregar tabs "Resumen" (contenido actual) y "Contactos" (nuevo)
- [ ] 6.3 Integrar `ContactList` en el tab "Contactos" pasando `companyId` de la empresa seleccionada
- [ ] 6.4 Integrar `EnrichAction` en el tab "Contactos" (debajo del título del tab)
- [ ] 6.5 Escribir tests: drawer renderiza ambos tabs, click en "Contactos" muestra `ContactList`, `EnrichAction` está presente

## 7. Ruta /leads

- [ ] 7.1 Crear `app/leads/page.tsx`: layout con panel de filtros (compacto, arriba) y `ContactList` sin `companyId`
- [ ] 7.2 Crear `components/leads/LeadsFilterBar.tsx`: select de empresa (carga lista de empresas), input de cargo con debounce 300ms, radio de confiabilidad, badge contador + botón "Limpiar"
- [ ] 7.3 Conectar `LeadsFilterBar` con `useLeadsFilters()` — cambios de filtro disparan refetch del hook `useContacts()`
- [ ] 7.4 Agregar enlace a `/leads` en la navegación principal del layout (`app/layout.tsx`)
- [ ] 7.5 Escribir test de integración: navegar a `/leads`, aplicar filtro de empresa, verificar que `ContactList` se actualiza

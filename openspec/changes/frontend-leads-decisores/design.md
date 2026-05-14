## Context

El frontend del Radar Dashboard ya existe (change `frontend-radar-dashboard`): Next.js 15 App Router, TanStack Query, Zustand, nuqs, shadcn/ui. Este change construye encima de esa base sin duplicar infraestructura.

El backend expone `GET /api/v1/companies/{id}/contacts` (definido en el spec `contact-enrichment`). Los contactos tienen: nombre, cargo, email, linkedin_url, teléfono, confiabilidad (high/medium/low).

La pantalla de Leads tiene dos puntos de acceso:
1. Ruta propia `/leads` — lista consolidada de todos los decisores
2. Tab "Contactos" dentro del drawer de empresa en el Radar (`/`)

## Goals / Non-Goals

**Goals:**
- Ruta `/leads` con lista de contactos paginada, filtros por empresa y cargo
- Tab "Contactos" integrado en el drawer de empresa existente
- Tarjeta de contacto: email copiable, link LinkedIn, teléfono, badge confiabilidad
- Acción "Buscar decisores" que dispara el enriquecimiento de una empresa
- Ampliación del cliente API con funciones de contacts
- Tests con Vitest + Testing Library

**Non-Goals:**
- CRM embebido ni historial de interacciones con contactos — fase futura
- Agregar/editar contactos manualmente — los datos vienen de Apollo
- Export a CSV — se trabaja en la pantalla de Reportes (change futuro)
- Notificaciones cuando se encuentran nuevos decisores

## Decisions

### 1. Dos puntos de acceso, un solo componente de contactos

**Decisión:** `ContactList` es un componente compartido que funciona tanto en `/leads` (con filtro de empresa) como en el drawer del Radar (filtrado implícito por empresa seleccionada).

**Por qué:** Evita duplicar lógica de renderizado. El componente recibe `companyId?: string` — si viene, filtra por empresa; si no viene, muestra todos. La query key de TanStack Query incluye `companyId` para cachear por separado.

**Alternativa descartada:** Dos componentes separados (`LeadsTable` y `CompanyContacts`) — duplicación innecesaria, dos lugares para mantener la misma UI.

---

### 2. Ruta `/leads` con filtros en URL (mismo patrón que `/`)

**Decisión:** Los filtros de la pantalla `/leads` (empresa, cargo, confiabilidad) se sincronizan con URL params usando `nuqs`, igual que en el Radar Dashboard.

**Por qué:** Consistencia con el patrón ya establecido. El equipo comercial puede compartir una búsqueda específica de contactos.

---

### 3. Acción de enriquecimiento: mutation de TanStack Query + feedback optimista

**Decisión:** El botón "Buscar decisores" usa `useMutation` de TanStack Query para llamar a `POST /api/v1/companies/enrich`. Muestra un estado de loading en el botón y al completar invalida la query de contacts de esa empresa.

**Por qué:** `useMutation` + `invalidateQueries` es el patrón estándar de TanStack Query para acciones que modifican datos. La invalidación fuerza un refetch automático de los contactos actualizados.

**Alternativa descartada:** Refetch manual con setTimeout — frágil, no garantiza que el backend haya terminado el enriquecimiento (que es async).

---

### 4. Email copiable con `navigator.clipboard` + toast feedback

**Decisión:** Click en el email copia al portapapeles usando `navigator.clipboard.writeText()`. Un toast (shadcn/ui `Sonner`) confirma la acción.

**Por qué:** El caso de uso más común para el equipo comercial es copiar el email para enviarlo. Un click es mejor que seleccionar texto manualmente. El toast evita ambigüedad sobre si la acción funcionó.

---

### 5. Tab "Contactos" en el drawer existente del Radar

**Decisión:** El `CompanyDetailDrawer` del Radar recibe un nuevo tab usando el componente `Tabs` de shadcn/ui. Los tabs son: "Resumen" (contenido actual) y "Contactos" (nuevo).

**Por qué:** Evita navegar fuera del contexto del Radar para ver los contactos de una empresa seleccionada. El equipo comercial puede revisar score + contactos en un solo lugar.

**Alternativa descartada:** Link "Ver contactos" que navega a `/leads?company=<id>` — rompe el flujo, el usuario pierde el contexto de la tabla de empresas.

## Risks / Trade-offs

- **[Risk] Enriquecimiento async: los contactos pueden no aparecer inmediatamente** → Mitigation: mostrar mensaje "Buscando decisores... puede tomar unos segundos" con polling cada 3s hasta que `contacts.length` cambie o pase 30s.

- **[Risk] `navigator.clipboard` requiere HTTPS en producción** → Mitigation: fallback a `document.execCommand('copy')` si clipboard no está disponible. Para desarrollo local (HTTP) puede fallar en algunos browsers.

- **[Trade-off] ContactList como componente compartido** → Requiere un contrato claro de props. Si los dos contextos divergen mucho en el futuro, puede ser mejor separar. Para MVP está bien unificado.

## Migration Plan

1. Ampliar `lib/api/` con función `listContacts(companyId)` y tipos Contact
2. Crear store Zustand `useLeadsFiltersStore` para filtros de `/leads`
3. Implementar `ContactCard` y `ContactList` (componentes compartidos)
4. Agregar tab "Contactos" al drawer existente
5. Crear ruta `app/leads/page.tsx` con filtros y listado
6. Tests de componentes

**Rollback:** No hay cambios destructivos — se agrega funcionalidad nueva y se extiende el drawer existente con un tab.

## Open Questions

- ¿La lista `/leads` debe mostrar contactos de TODAS las empresas o solo de las que están en el radar activo (filtradas por score mínimo)? Recomiendo todas, con filtro de empresa disponible.
- ¿El botón "Buscar decisores" va en el drawer del Radar o solo en `/leads`? Recomiendo en ambos.

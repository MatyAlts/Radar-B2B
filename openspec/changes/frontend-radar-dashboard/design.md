## Context

El backend FastAPI ya expone `GET /api/v1/companies` con filtros y paginación. El frontend es un proyecto nuevo — no hay código existente que migrar. El usuario final es el equipo comercial: necesita una interfaz rápida, clara y que priorice la información más relevante (score, temperatura, señales).

El stack definido en el proyecto es React/Next.js. Este change implementa la pantalla 1 del dashboard de 5 pantallas planificadas.

## Goals / Non-Goals

**Goals:**
- Proyecto Next.js 15 (App Router) listo para producción
- Pantalla principal con listado de empresas ordenado por score
- Filtros por sector, temperatura y nombre — sincronizados con URL params
- Tarjeta de empresa con score visual, temperatura color-coded y señales
- Data fetching con TanStack Query (cache, refetch, loading/error states)
- Tests con Vitest + Testing Library (TDD)

**Non-Goals:**
- Pantallas 2-5 del dashboard (Leads, Señales, Scoring, Reportes) — changes futuros
- Autenticación de usuarios — fase 2
- Modo oscuro — fase 2
- Mobile-first — el MVP es para desktop (equipo comercial usa PC)

## Decisions

### 1. Next.js 15 con App Router (no Pages Router)

**Decisión:** App Router con Server Components por defecto. El listado inicial de empresas se renderiza en el servidor (RSC), los filtros y la interactividad son Client Components.

**Por qué:** App Router es el futuro de Next.js. Los RSC reducen el JS enviado al cliente para datos estáticos. La separación server/client es natural para este caso: la tabla de empresas se puede pre-renderizar, los filtros son interactivos.

**Alternativa descartada:** Pages Router — legacy, no tiene RSC, más difícil de migrar después.

---

### 2. TanStack Query para data fetching en Client Components

**Decisión:** TanStack Query (`@tanstack/react-query`) para todas las llamadas a la API del backend desde Client Components. No usar SWR ni fetch manual.

**Por qué:** TanStack Query tiene cache, deduplicación de requests, refetch automático, y `keepPreviousData` que es fundamental para paginación sin flickers. La DX es superior a fetch manual o SWR para casos con filtros que cambian frecuentemente.

**Alternativa descartada:** SWR — menos features para paginación. Fetch manual en useEffect — sin cache, propenso a race conditions.

---

### 3. Zustand para estado global de filtros

**Decisión:** Un store Zustand `useRadarFiltersStore` que mantiene el estado de los filtros activos (sector, temperatura, score range, query de búsqueda).

**Por qué:** Los filtros se comparten entre el panel de filtros y la tabla de resultados. Zustand es liviano (sin boilerplate de Redux), síncrono con URL params, y fácil de testear.

**Alternativa descartada:** useState local con prop drilling — escala muy mal cuando se agregan más componentes. URL state solo (nuqs) — bueno para shareable URLs pero complejo para estado derivado.

---

### 4. URL sync de filtros con `nuqs`

**Decisión:** Los filtros se sincronizan con los search params de la URL usando `nuqs`. Al cambiar un filtro, la URL se actualiza; al compartir la URL, el estado de filtros se restaura.

**Por qué:** Los usuarios comerciales necesitan poder compartir una búsqueda específica con sus colegas. La URL es la fuente de verdad para filtros.

---

### 5. shadcn/ui + Tailwind CSS para UI

**Decisión:** shadcn/ui como librería de componentes base, Tailwind CSS para estilos.

**Por qué:** shadcn/ui provee componentes accesibles (Radix UI) sin lock-in — el código es tuyo. Tailwind es el estándar en proyectos Next.js modernos. La combinación permite velocidad de desarrollo sin sacrificar control.

**Alternativa descartada:** Material UI — demasiado opinionated, difícil de customizar. Chakra UI — más pesado y menos trendy en 2025.

---

### 6. Estructura de carpetas: Feature-based dentro de App Router

```
frontend/
├── app/
│   ├── layout.tsx           # Root layout con providers
│   ├── page.tsx             # Radar dashboard (RSC shell)
│   └── companies/
│       └── [id]/page.tsx    # Detalle empresa (futuro)
├── components/
│   ├── radar/               # Componentes específicos del radar
│   │   ├── CompanyTable.tsx
│   │   ├── CompanyCard.tsx
│   │   ├── ScoreBadge.tsx
│   │   ├── TemperatureBadge.tsx
│   │   └── SignalsDisplay.tsx
│   └── ui/                  # Componentes shadcn (auto-generados)
├── lib/
│   ├── api/                 # Cliente HTTP + tipos de respuesta
│   └── store/               # Zustand stores
└── hooks/                   # Custom hooks (useCompanies, useFilters)
```

**Por qué:** Feature-based agrupa lo que cambia junto. Los componentes `radar/` son específicos del dominio; `ui/` son genéricos. Separa la lógica de negocio (hooks + store) de la UI.

## Risks / Trade-offs

- **[Risk] CORS del backend no configurado correctamente** → Mitigation: el backend ya tiene CORS para `localhost:3000` según el design del mvp-backend. Verificar al integrar.

- **[Risk] API del backend aún no implementada** → Mitigation: usar mock data (`src/lib/api/mock.ts`) para desarrollo del frontend en paralelo al backend. Cambiar a API real cuando esté disponible.

- **[Trade-off] RSC vs Client Components** → Los RSC no pueden usar hooks ni estado. Si en el futuro se necesitan filtros server-side (para SEO), hay que refactorizar. Para MVP con usuario interno, el enfoque client-side para filtros es correcto.

- **[Risk] Score_justification puede ser null** → La justificación de Claude es asíncrona. La UI debe manejar el caso `null` mostrando un skeleton o texto de "generando...".

## Migration Plan

1. Crear proyecto Next.js en `frontend/` con `create-next-app`
2. Configurar Tailwind + shadcn/ui
3. Implementar cliente API con mock data
4. Implementar store Zustand + filtros con nuqs
5. Implementar componentes UI (CompanyCard, ScoreBadge, etc.)
6. Integrar con API real del backend
7. Tests con Vitest + Testing Library

**Rollback:** Proyecto nuevo — no hay rollback necesario.

## Open Questions

- ¿El listado va en tabla (filas/columnas) o en cards (grid)? Para MVP recomiendo tabla con columnas fijas, más denso en información.
- ¿Cuántas empresas por página por defecto? Recomiendo 20.
- ¿El dashboard necesita refresh automático o es on-demand?

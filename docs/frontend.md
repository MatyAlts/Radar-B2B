# Frontend

## Stack

| Tecnología | Versión | Rol |
|------------|---------|-----|
| Next.js | 16.2.6 | Framework React (App Router) |
| React | 19.2.4 | UI library |
| TypeScript | 5.x | Tipado estático |
| Tailwind CSS | 4.x | Estilos utilitarios |
| TanStack Query | 5.x | Server state (fetch, cache, refetch) |
| Zustand | 5.x | UI state (filtros, selecciones) |
| nuqs | 2.x | URL search params como state |
| Radix UI | — | Componentes accesibles (Dialog, Select, etc.) |
| Vitest | 4.x | Tests unitarios |
| Playwright | 1.45+ | Tests E2E |

## Estructura

```
frontend/
├── app/                    ← App Router (Next.js)
│   ├── layout.tsx          ← Layout raíz (providers, nav)
│   ├── page.tsx            ← Radar de Oportunidades (/)
│   └── leads/              ← Leads y Decisores (/leads)
│       └── page.tsx
│
├── components/
│   ├── layout/             ← PageContainer, navegación
│   ├── radar/              ← Componentes del Radar
│   │   ├── CompanyTable.tsx        ← Tabla de empresas
│   │   ├── CompanyDetailDrawer.tsx ← Drawer lateral de detalle
│   │   ├── FilterPanel.tsx         ← Panel de filtros izquierdo
│   │   ├── FilterBar.tsx           ← Barra de filtros activos
│   │   ├── Pagination.tsx          ← Paginación
│   │   ├── ScoreBadge.tsx          ← Badge de score numérico
│   │   ├── TemperatureBadge.tsx    ← Badge caliente/tibio/frío
│   │   ├── SignalsDisplay.tsx      ← Visualización de señales
│   │   ├── details/                ← Secciones del drawer
│   │   └── filters/                ← Componentes de filtros
│   ├── leads/              ← Componentes de Leads
│   └── ui/                 ← Design system (Button, Badge, Dialog, etc.)
│
├── lib/
│   ├── api/                ← Clientes HTTP hacia el backend
│   │   ├── companies.ts    ← Fetch companies, enrich, sync, delete
│   │   └── types.ts        ← TypeScript types (Company, Contact, etc.)
│   ├── hooks/              ← React hooks customizados
│   │   ├── use-companies.ts    ← TanStack Query hook para empresas
│   │   ├── use-radar-filters.ts ← Filtros con nuqs (URL state)
│   │   └── usePagination.ts    ← Paginación client-side
│   ├── store/              ← Zustand stores
│   └── utils/
│       ├── helpContent.ts  ← Textos de ayuda contextual
│       └── utils.ts        ← Utilidades generales
│
└── tests/                  ← Tests E2E Playwright
```

## Páginas

### `/` — Radar de Oportunidades

Vista principal. Muestra todas las empresas detectadas con:
- **FilterPanel** (izquierda): filtros por industria, temperatura y score
- **CompanyTable** (derecha): lista de empresas con score, temperatura y señales
- **Botón Sincronizar**: dispara `POST /companies/sync` y recarga la lista
- **CompanyDetailDrawer**: slide-over con detalle completo al hacer click en una empresa
- **Paginación**: cliente-side sobre los datos fetched

**URL state** (via nuqs): los filtros viven en la URL → bookmarkable, compartible.

### `/leads` — Leads y Decisores

Lista de decisores encontrados across todas las empresas.

## Patrones de estado

### Server state: TanStack Query

```typescript
// lib/hooks/use-companies.ts
export function useCompanies() {
  const filters = useRadarFilters()
  
  return useQuery({
    queryKey: ['companies', filters],
    queryFn: () => fetchCompanies(filters),
    placeholderData: keepPreviousData,  // evita flash en paginación
  })
}
```

### URL state: nuqs

```typescript
// lib/hooks/use-radar-filters.ts
export function useRadarFilters() {
  const [industries] = useQueryState('industries')
  const [temperature] = useQueryState('temperature')
  const [scoreMin] = useQueryState('score_min', parseAsInteger)
  const [page] = useQueryState('page', parseAsInteger.withDefault(1))
  // ...
}
```

### UI state: Zustand

Para estado que no va a la URL (ej: estado del drawer, loading states locales).

## Design System

Componentes en `components/ui/` basados en Radix UI + Tailwind CSS v4.

Tokens de diseño:
- `--color-primary` — color de acción principal
- `--color-success` — verde (score caliente)
- `--color-destructive` — rojo (errores)
- `--color-muted` — grises (texto secundario)
- `--color-border` — bordes

## Testing

### Unitarios (Vitest + Testing Library)

```bash
cd frontend && npm test
```

Archivos de test: `*.test.tsx` junto a cada componente.

**Patrón:**
```typescript
// CompanyTable.test.tsx
it('muestra estado de loading', () => {
  render(<CompanyTable companies={[]} isLoading={true} ... />)
  expect(screen.getByText(/cargando/i)).toBeInTheDocument()
})
```

### E2E (Playwright)

```bash
cd frontend && npm run test:e2e
```

Tests en `tests/` — cubren flujos completos:
- Ver lista de empresas
- Aplicar filtros y verificar resultados
- Abrir drawer de detalle
- Sincronizar desde Apollo

## Variables de entorno

```ini
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:18000
```

La URL del backend se inyecta en build time (o en runtime si se usa Docker).

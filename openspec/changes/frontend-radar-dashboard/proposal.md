## Why

El backend del Radar ya tiene una API REST funcional, pero sin interfaz visual el equipo comercial no puede usar el producto. El Dashboard de Radar es la primera pantalla que los usuarios finales van a ver: lista de empresas priorizadas por score, con filtros por sector y temperatura (caliente/tibio/frío).

## What Changes

- Nuevo proyecto frontend Next.js (App Router) con Tailwind CSS y shadcn/ui
- Página principal `/` con tabla/lista de empresas del radar ordenada por score
- Filtros interactivos: por sector, temperatura, rango de score, búsqueda por nombre
- Tarjeta de empresa con score visual, temperatura y señales activas
- Paginación del listado de empresas
- Integración con la API REST del backend (`/api/v1/companies`)
- Estado global liviano con Zustand para filtros y selección de empresa
- Skeleton loaders y manejo de estados vacíos/error

## Capabilities

### New Capabilities

- `radar-company-list`: Listado paginado de empresas con filtros por sector, temperatura y búsqueda, ordenado por score descendente
- `company-score-card`: Tarjeta visual de empresa con score (0-100), temperatura color-coded, señales activas y justificación IA
- `radar-filters`: Panel de filtros interactivo (sector, temperatura, score range, búsqueda por nombre) con URL state sync
- `api-client`: Cliente HTTP del frontend para consumir la API del backend, con manejo de errores y loading states

### Modified Capabilities

## Impact

- **Nuevo proyecto**: `frontend/` dentro del monorepo (o repo separado)
- **Dependencias**: Next.js 15, React 19, Tailwind CSS, shadcn/ui, Zustand, TanStack Query, axios/fetch
- **Consume**: `GET /api/v1/companies` con filtros y paginación del backend
- **Variables de entorno**: `NEXT_PUBLIC_API_URL` apuntando al backend FastAPI

## Why

Detectar una empresa con score alto no alcanza si no sabés a quién llamar. La pantalla de Leads y Decisores es la segunda más crítica del producto: muestra los contactos clave de cada empresa (nombre, cargo, email, LinkedIn, teléfono) para que el equipo comercial pueda actuar de inmediato sobre las oportunidades priorizadas.

## What Changes

- Nueva ruta `/leads` en el frontend con lista de decisores consolidada (todos los contactos, de todas las empresas)
- Vista de contactos por empresa accesible desde el drawer de detalle del Radar (`/` → empresa seleccionada → tab "Contactos")
- Tarjeta de contacto con cargo, email copiable, link a LinkedIn y teléfono
- Filtros por empresa, cargo y nivel de confiabilidad del dato
- Acción de "enriquecer" empresa (trigger del endpoint `POST /api/v1/companies/enrich`) para disparar búsqueda de nuevos decisores
- Integración con los endpoints del backend: `GET /api/v1/companies/{id}/contacts`
- Ampliación del cliente API (`api-client`) con funciones para contacts

## Capabilities

### New Capabilities

- `leads-list`: Listado consolidado de todos los decisores a través de todas las empresas, filtrable por empresa, cargo y confiabilidad
- `contact-card`: Tarjeta de contacto con nombre, cargo, badge de confiabilidad, email copiable, botón LinkedIn y teléfono
- `enrich-action`: Botón de acción para disparar el enriquecimiento de contactos de una empresa desde el frontend

### Modified Capabilities

- `api-client`: Agregar función `listContacts(companyId)` y tipos `Contact`, `ContactReliability` al cliente existente

## Impact

- **Nueva ruta**: `app/leads/page.tsx` en el proyecto Next.js del frontend
- **Componentes reutilizados**: drawer de empresa del Radar Dashboard (se agrega tab de contactos)
- **Consume**: `GET /api/v1/companies/{id}/contacts` y `POST /api/v1/companies/enrich`
- **Dependencia**: el change `frontend-radar-dashboard` debe existir (usa su estructura de proyecto y cliente API)

# API Reference

Base URL: `http://localhost:18000/api/v1`

Documentación interactiva: [Swagger UI](http://localhost:18000/api/v1/docs) | [ReDoc](http://localhost:18000/api/v1/redoc)

---

## Health

### `GET /health`

Verifica que el servicio está funcionando.

**Respuesta:**
```json
{
  "status": "ok",
  "service": "radar-b2b-api"
}
```

---

## Companies

### `GET /companies`

Lista empresas con filtros opcionales y paginación.

**Query params:**

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `page` | int | 1 | Número de página (≥ 1) |
| `page_size` | int | 10 | Resultados por página (1–100) |
| `industries` | string | — | Industrias separadas por coma (`Mining,Logistics`) |
| `temperature` | string | — | `caliente` \| `tibio` \| `frío` |
| `score_min` | int | — | Score mínimo (0–100) |
| `score_max` | int | — | Score máximo (0–100) |
| `query` | string | — | Búsqueda por nombre de empresa |

**Respuesta:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Empresa Ejemplo S.A.",
      "industry": "Mining",
      "city": "La Paz",
      "country": "Bolivia",
      "employee_count": 150,
      "website": "ejemplo.com",
      "apollo_id": "apollo_org_id",
      "score": 75,
      "temperature": "caliente",
      "score_justification": "Empresa del sector minero con participación en licitaciones SICOES y decisor identificado.",
      "strategic_sector": true,
      "recent_growth": false,
      "sicoes_participation": true,
      "adequate_size": true,
      "decision_maker_found": true,
      "purchase_signal": true,
      "created_at": "2026-01-01T00:00:00",
      "updated_at": "2026-01-15T10:30:00",
      "last_enriched_at": "2026-01-15T10:30:00"
    }
  ],
  "total": 42,
  "page": 1,
  "page_size": 10,
  "total_pages": 5
}
```

---

### `POST /companies`

Crea una nueva empresa manualmente.

**Body:**
```json
{
  "name": "Empresa Nueva S.R.L.",
  "industry": "Logistics"
}
```

**Respuesta:** `CompanyResponse` (ver arriba)

---

### `GET /companies/{company_id}`

Obtiene una empresa por ID.

**Respuesta:** `CompanyResponse`

**Errores:**
- `404 Not Found` — empresa no existe

---

### `POST /companies/{company_id}/enrich`

Enriquece una empresa con datos de Apollo.io y busca decisores.

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `domain` | string | Dominio web de la empresa (ej: `minera.com`). Si se omite, usa `company.website` |

**Proceso interno:**
1. Consulta Apollo con el dominio → actualiza datos de la empresa
2. Busca decisores en Apollo por `apollo_id` → crea/actualiza Contacts
3. Recalcula score + genera justificación con Gemini
4. Persiste cambios en PostgreSQL

**Respuesta:** `CompanyResponse` actualizado

**Errores:**
- `404 Not Found` — empresa no existe
- `400 Bad Request` — sin dominio disponible o falla de enriquecimiento

---

### `POST /companies/{company_id}/score`

Recalcula el score de una empresa sin re-enriquecer.

**Respuesta:** `CompanyResponse` con score actualizado

---

### `GET /companies/{company_id}/contacts`

Lista los decisores de una empresa.

**Respuesta:**
```json
[
  {
    "id": "uuid",
    "company_id": "uuid",
    "name": "Juan Pérez",
    "title": "Gerente de Compras",
    "email": "jperez@empresa.com",
    "phone": "+591 2 1234567",
    "linkedin_url": "https://linkedin.com/in/jperez",
    "reliability": "high",
    "last_updated_at": "2026-01-15T10:30:00"
  }
]
```

> `reliability`: `high` (confidence ≥ 0.7) | `medium` (≥ 0.4) | `low` (< 0.4)

---

### `DELETE /companies/{company_id}`

Elimina una empresa.

**Respuesta:**
```json
{ "status": "success" }
```

**Errores:**
- `404 Not Found` — empresa no existe

---

### `POST /companies/sync`

Importa empresas desde Apollo.io por industria y ubicación.

**Body:**
```json
{
  "industries": ["Mining", "Logistics", "Agriculture", "Industrial Engineering", "Warehousing"],
  "locations": ["Bolivia"]
}
```

**Proceso:**
1. Busca organizaciones en Apollo con los filtros especificados
2. Descarta duplicados (por `apollo_id`)
3. Crea nuevas empresas en PostgreSQL con score inicial = 0

**Respuesta:**
```json
{
  "status": "success",
  "synced_count": 23
}
```

---

## Signals

> Endpoints de señales de mercado. Documentación en progreso — ver [Swagger UI](http://localhost:18000/api/v1/docs).

---

## Códigos de error

| Código | Descripción |
|--------|-------------|
| `400` | Bad Request — parámetros inválidos o lógica de negocio |
| `404` | Not Found — recurso inexistente |
| `422` | Unprocessable Entity — validación de schema fallida (Pydantic) |
| `500` | Internal Server Error — error inesperado del servidor |

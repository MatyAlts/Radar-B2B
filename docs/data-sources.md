# Fuentes de Datos

## Apollo.io

**Rol:** Base principal para empresas y contactos (decisores).

**Documentación oficial:** https://docs.apollo.io/ (usar Firecrawl para scrapear)

### Endpoints usados

| Operación | Endpoint Apollo | Método |
|-----------|----------------|--------|
| Buscar organizaciones | `organizations/search` | POST |
| Enriquecer organización | `organizations/enrich` | POST |
| Buscar contactos/decisores | `people/search` | POST |

### Cliente implementado

`src/infrastructure/apollo/client.py`

```python
class ApolloClient:
    BASE_URL = "https://api.apollo.io/v1"
    MAX_RETRIES = 3       # Reintentos con backoff exponencial
    INITIAL_BACKOFF = 1   # segundos

    # Autenticación: header X-Api-Key
    # Timeout: 30 segundos por request
```

**Manejo de rate limiting:** Si Apollo devuelve `429`, se aplica backoff exponencial hasta MAX_RETRIES.

### Búsqueda de organizaciones

```python
await apollo.search_organizations(
    industries=["Mining", "Logistics", "Agriculture"],
    locations=["Bolivia"],
    min_employees=10,
    max_employees=500,
)
# Devuelve lista de orgs desde accounts/organizations/companies según respuesta
```

### Enriquecimiento

```python
await apollo.enrich_organization(domain="empresa.com")
# Devuelve: id, website_url, estimated_num_employees, industry, city, country
```

### Búsqueda de decisores

```python
await apollo.search_contacts(
    organization_ids=["apollo_org_id"],
    titles=["CEO", "Gerente General", "Gerente de Compras", "Jefe de Logística", ...],
)
# Devuelve: first_name, last_name, title, email, linkedin_url, phone_numbers
```

**Cargos objetivo buscados:**
- CEO, CFO, COO, CTO
- General Manager / Gerente General
- Gerente de Operaciones / Compras
- Jefe de Compras / Logística / Mantenimiento
- Director, Owner/Dueño, Presidente
- Procurement, Supply Chain

### Confidence score

Al crear un contacto desde Apollo:
- `0.8` si tiene email
- `0.4` si no tiene email

---

## SICOES

**Rol:** Señales de licitaciones públicas en Bolivia.

**Qué es:** Sistema de Contrataciones del Estado de Bolivia. Publica convocatorias, adjudicaciones y contratos de entidades públicas.

**Estado actual:** Integración planificada (`src/infrastructure/sicoes/`). La señal `sicoes_participation` se activa manualmente o mediante scraping futuro.

**Información relevante a extraer:**
- Nombre de la empresa adjudicataria
- Monto del contrato
- Tipo de bien/servicio
- Fecha de adjudicación
- Entidad contratante

---

## Prensa Industrial

**Rol:** Detectar señales de expansión, inversión o crecimiento en empresas objetivo.

**Estado actual:** Planificado. La señal `recent_growth` se activa manualmente.

**Fuentes potenciales:**
- Medios especializados bolivianos (El Deber Económico, Los Tiempos Negocios)
- Comunicados de prensa corporativos
- LinkedIn company posts

**Proceso planeado:**
1. Scraping periódico de fuentes configuradas
2. Gemini analiza el texto → tipo de señal + relevancia + resumen
3. Si `relevance_score >= 0.6` → se activa la señal correspondiente en la empresa

---

## Gemini AI (Google)

**Rol:** Generación de justificaciones y análisis de señales.

**Modelo usado:** `gemini-3.1-flash-lite`

**Cliente:** `src/infrastructure/ai/gemini_client.py`

### Casos de uso

**1. Justificación de score**
```python
await gemini.generate_score_justification(company, signals)
# Output: texto de 2-3 oraciones explicando el score
# Fallback determinista si Gemini falla
```

**2. Análisis de señal de mercado**
```python
await gemini.analyze_signal(
    company_name="Empresa S.A.",
    signal_text="texto de la noticia o licitación",
    source="sicoes|news|linkedin"
)
# Output: { tipo, relevancia (0-1), resumen }
```

**Tipos de señal detectados por Gemini:**
- `expansion` — apertura de planta, nueva sucursal
- `licitacion` — participación en proceso público
- `inversion` — proyecto de inversión
- `contratacion` — contratación masiva de personal
- `otro` — señal relevante no categorizable

**Configuración:**
```ini
GEMINI_API_KEY=tu_api_key
```

Si `GEMINI_API_KEY` no está configurado, el sistema funciona con justificaciones deterministas (fallback).

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

**Estado actual:** ✅ Implementado. El scraper consulta contratos resueltos y activa automáticamente la señal `sicoes_participation` en `CompanyService.sync_from_apollo()`.

**Cliente implementado:** `src/infrastructure/sicoes/scraper.py`

### Mecanismo de autenticación

SICOES **no requiere CAPTCHA** para la búsqueda pública (el captcha solo aplica al login de proveedores/entidades). Sí requiere un flujo de 3 pasos para obtener el token correcto:

```
1. GET /portal/index.php
   → extrae #token del HTML

2. GET /portal/contrataciones/contResueltos.php?token=<token_index>
   → extrae un NUEVO token del formulario de búsqueda
     (el token cambia entre páginas — token_index ≠ token_busqueda)

3. POST /portal/contrataciones/operacion.php
   → body: operacion=contResueltos&empresa=<nombre>&r1=&token=<token_busqueda>
   → respuesta: JSON DataTable { recordsTotal, recordsFiltered, data }
```

Si el token es incorrecto, el servidor devuelve HTML en lugar de JSON.

### Método principal

```python
scraper = SicoesScraper()
result = await scraper.check_company_participation("Empresa S.R.L.")
# True si recordsFiltered > 0, False si no hay resultados
```

### Normalización de nombres

Antes de buscar, `_normalize_name()` elimina sufijos legales comunes para mejorar el match:

- S.R.L., S.A., S.A.M., S.C.R.L., E.I.R.L., S.A.S., LTDA.

> **Gotcha:** El regex `\b(S\.R\.L\.)\b` falla porque `\b` después de punto no funciona correctamente.
> La solución es anclar al final: `\s+(S\.R\.L\.|...)\s*$`

### Integración con CompanyService

```python
# Se llama automáticamente por cada empresa nueva en sync_from_apollo()
await company_service.enrich_sicoes(company_id)
# Actualiza company.sicoes_participation = True/False
```

### Script de sync masivo

`scripts/sync_sicoes.py` — corre sobre todas las empresas existentes en DB con delay de 1s entre requests para evitar sobrecarga al servidor. Hace `commit()` por empresa (no al final) para que un error a mitad del proceso no descarte el trabajo anterior.

### Información relevante extraída

Actualmente solo se verifica **presencia** (booleano). A futuro se puede extraer:
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

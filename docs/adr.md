# Architecture Decision Records

Registro de decisiones técnicas importantes tomadas durante el desarrollo del Radar B2B.

---

## ADR-001: Clean Architecture como estilo arquitectónico

**Estado:** Aceptado  
**Fecha:** Inicio del proyecto

**Contexto:**
Sistema con múltiples fuentes de datos externas (Apollo, SICOES, prensa) y necesidad de intercambiabilidad.

**Decisión:**
Adoptar Clean Architecture con capas: Domain → Services → Infrastructure → API.

**Consecuencias:**
- ✅ Dominio testeable sin dependencias externas
- ✅ Fácil de cambiar Apollo por otra fuente de datos
- ✅ Reglas de negocio (scoring) completamente aisladas
- ⚠️ Más boilerplate inicial (interfaces, mapeo entre capas)

---

## ADR-002: SQLAlchemy async con asyncpg

**Estado:** Aceptado  
**Fecha:** Setup inicial del backend

**Contexto:**
FastAPI es async-first. Necesitamos ORM que no bloquee el event loop.

**Decisión:**
SQLAlchemy 2.x con `AsyncSession` + driver `asyncpg`.

**Consecuencias:**
- ✅ Queries no bloquean el event loop de uvicorn
- ✅ Buen soporte con Alembic para migraciones
- ⚠️ Alembic requiere configuración especial para modo async (`run_sync`)

---

## ADR-003: Gemini en lugar de OpenAI

**Estado:** Aceptado  
**Fecha:** Implementación del scoring con IA

**Contexto:**
Necesitamos generar justificaciones de score y analizar señales de mercado con LLM.

**Decisión:**
Usar Google Gemini (`gemini-3.1-flash-lite`) en lugar de OpenAI GPT.

**Razones:**
- Costo significativamente menor para el volumen de requests esperado
- Suficiente calidad para justificaciones de 2-3 oraciones
- Sin dependencias de OpenAI (evitar vendor lock-in doble)

**Consecuencias:**
- ✅ Menor costo operativo
- ✅ Fallback determinista implementado si Gemini falla
- ⚠️ API de Google Genai SDK tiene diferencias vs OpenAI SDK

---

## ADR-004: TanStack Query + Zustand en el frontend

**Estado:** Aceptado  
**Fecha:** Implementación del dashboard frontend

**Contexto:**
Necesitamos manejar server state (empresas, contactos) y UI state (filtros, selecciones) de forma separada.

**Decisión:**
- **TanStack Query v5** para server state (fetch, cache, invalidación, refetch)
- **Zustand v5** para UI state (selecciones, estado de modales)
- **nuqs v2** para filtros en URL (bookmarkable, shareable)

**Consecuencias:**
- ✅ Separación clara de responsabilidades
- ✅ Filtros en URL → se pueden compartir links con filtros aplicados
- ✅ TanStack Query maneja loading/error/stale states automáticamente
- ⚠️ TanStack Query v5 tiene breaking changes vs v4 (`placeholderData` en lugar de `keepPreviousData` como opción)

---

## ADR-005: Poetry 2.0+ para gestión de dependencias Python

**Estado:** Aceptado  
**Fecha:** Dockerización del backend

**Contexto:**
Poetry cambió su API en la versión 2.0.

**Decisión:**
Usar `--without dev` en lugar del deprecado `--no-dev` en el Dockerfile.

**Aprendizaje clave:**
```dockerfile
# ❌ Poetry 1.x (deprecado)
RUN poetry install --no-dev

# ✅ Poetry 2.0+
RUN poetry install --without dev --no-root
```

---

## ADR-006: Estrategia de scoring determinista primero

**Estado:** Aceptado  
**Fecha:** Diseño del motor de scoring

**Contexto:**
El score podría calcularse con ML o con reglas. Dado que es un MVP y los criterios son bien conocidos por el negocio, se optó por reglas explícitas.

**Decisión:**
Scoring basado en 6 señales booleanas con pesos fijos y predefinidos. La IA solo genera la *justificación*, no el score en sí.

**Razones:**
- Explicable: el usuario entiende exactamente por qué una empresa tiene X puntos
- Auditable: no hay caja negra
- Modificable: ajustar pesos es trivial sin re-entrenar modelos
- Rápido: cálculo instantáneo, sin latencia de API

**Consecuencias:**
- ✅ Scoring transparente y explicable
- ✅ Sin dependencia de ML para el path crítico
- ⚠️ Los pesos son fijos — si el negocio cambia de opinión, hay que deployar

---

## ADR-007: Retry con backoff exponencial en ApolloClient

**Estado:** Aceptado  
**Fecha:** Implementación del cliente Apollo

**Contexto:**
Apollo.io tiene rate limiting (429) y puede fallar por issues transitorios.

**Decisión:**
Implementar retry con backoff exponencial: hasta 3 intentos, empezando en 1s, duplicando en cada fallo.

```python
backoff = 1  # segundos
for attempt in range(3):
    try:
        response = await client.request(...)
        if response.status_code == 429:
            await asyncio.sleep(backoff)
            backoff *= 2
            continue
        return response.json()
    except httpx.HTTPError:
        await asyncio.sleep(backoff)
        backoff *= 2
```

**Consecuencias:**
- ✅ Resiliencia ante rate limiting y errores transitorios
- ⚠️ En el peor caso, una request puede tardar hasta 7 segundos (1+2+4)

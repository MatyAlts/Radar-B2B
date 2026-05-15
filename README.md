# Radar B2B Inteligente — Documentación

Plataforma de inteligencia comercial que detecta empresas con alta probabilidad de compra en sectores industriales de Bolivia (industria, logística, agro, minería y almacenamiento).

## Índice

| Documento | Descripción |
|-----------|-------------|
| [Arquitectura](./docs/architecture.md) | Clean Architecture, capas, decisiones de diseño |
| [Primeros pasos](./docs/getting-started.md) | Setup local y con Docker |
| [API Reference](./docs/api-reference.md) | Endpoints REST, parámetros y respuestas |
| [Motor de Scoring](./docs/scoring-engine.md) | Algoritmo de puntaje (0–100) e IA |
| [Fuentes de Datos](./docs/data-sources.md) | Apollo.io, SICOES, señales de mercado |
| [Frontend](./docs/frontend.md) | Next.js 16, componentes, estado y testing |
| [Deployment](./docs/deployment.md) | Docker Compose, variables de entorno, CI/CD |
| [Decisiones Técnicas](./docs/adr.md) | Architecture Decision Records |

## Resumen del sistema

```
┌─────────────────────────────────────────────────────────────┐
│                     RADAR B2B INTELIGENTE                   │
├──────────────────┬──────────────────┬───────────────────────┤
│   Frontend       │   Backend API    │   Fuentes externas    │
│   Next.js 16     │   FastAPI        │                       │
│   React 19       │   Python 3.12    │   Apollo.io           │
│   TanStack Query │   PostgreSQL 15  │   SICOES              │
│   Zustand        │   SQLAlchemy     │   Prensa industrial   │
│   Tailwind v4    │   Alembic        │   Gemini AI           │
└──────────────────┴──────────────────┴───────────────────────┘
```

## Flujo principal

1. **Detección**: Apollo.io provee empresas por industria/ubicación → se almacenan en PostgreSQL
2. **Enriquecimiento**: Se consulta Apollo con el dominio de la empresa → datos adicionales + decisores
3. **Scoring**: 6 señales booleanas × pesos definidos → score 0–100 + temperatura (caliente/tibio/frío)
4. **Justificación IA**: Gemini genera texto en lenguaje natural explicando el score
5. **Dashboard**: Frontend muestra empresas filtradas, contactos y señales en tiempo real

## Inicio rápido

```bash
# Con Docker (recomendado)
cp .env.example .env  # configurar API keys
docker compose up -d

# Backend en http://localhost:18000
# Frontend en http://localhost:13000
# API Docs en http://localhost:18000/api/v1/docs
```

---

> **Nota sobre actualización:** Esta documentación se genera y mantiene en sync con el código. Para regenerarla ejecutá `python scripts/update_docs.py`.

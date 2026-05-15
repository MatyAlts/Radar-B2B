# Deployment

## Arquitectura de containers

```
docker-compose.yml
├── db        ← PostgreSQL 15 (port 15432)
├── api       ← FastAPI + uvicorn (port 18000)
└── frontend  ← Next.js (port 13000)
```

## Docker Compose

### Servicios

**db** — PostgreSQL 15 Alpine
```yaml
environment:
  POSTGRES_USER: radar
  POSTGRES_PASSWORD: radar_dev_password
  POSTGRES_DB: radar_db
ports:
  - "15432:5432"
```
Healthcheck: `pg_isready -U radar` cada 10s.

**api** — FastAPI en contenedor Python
```yaml
command: uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
ports:
  - "18000:8000"
depends_on:
  db:
    condition: service_healthy
```
- Carga `.env` del host
- Sobreescribe `DATABASE_URL` para apuntar al container `db`
- Volumen bind-mount para hot reload en desarrollo

**frontend** — Next.js
```yaml
build:
  args:
    NEXT_PUBLIC_API_URL: http://localhost:18000
ports:
  - "13000:3000"
depends_on:
  - api
```

### Comandos esenciales

```bash
# Levantar todo
docker compose up -d

# Reconstruir un servicio específico
docker compose build api
docker compose up -d api

# Ver logs en tiempo real
docker compose logs -f api
docker compose logs -f frontend

# Ejecutar migraciones
docker compose exec api alembic upgrade head

# Ejecutar shell en el container
docker compose exec api bash
docker compose exec db psql -U radar radar_db

# Apagar y borrar volumes (⚠️ borra datos)
docker compose down -v
```

## Variables de entorno

### Requeridas

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | URL de PostgreSQL (asyncpg driver) |
| `APOLLO_API_KEY` | API Key de Apollo.io |
| `GEMINI_API_KEY` | API Key de Google Gemini |

### Opcionales

| Variable | Default | Descripción |
|----------|---------|-------------|
| `API_PREFIX` | `/api/v1` | Prefijo de todos los endpoints |
| `DEBUG` | `false` | Modo debug (logs verbose, reload) |
| `CORS_ORIGINS` | localhost:3000/3001/13000 | Orígenes permitidos para CORS |
| `SCHEDULER_ENABLED` | `true` | Habilitar scheduler de tareas |
| `SICOES_UPDATE_INTERVAL_HOURS` | `6` | Frecuencia de actualización SICOES |

### Formato de DATABASE_URL

```
# PostgreSQL con driver asyncpg (requerido para SQLAlchemy async)
postgresql+asyncpg://user:password@host:port/dbname

# Ejemplos
postgresql+asyncpg://radar:radar_dev_password@localhost:15432/radar_db   # local
postgresql+asyncpg://radar:radar_dev_password@db:5432/radar_db           # dentro de docker
```

## Migraciones (Alembic)

```bash
# Aplicar todas las migraciones pendientes
alembic upgrade head

# Ver estado actual
alembic current

# Crear nueva migración
alembic revision --autogenerate -m "descripcion del cambio"

# Revertir última migración
alembic downgrade -1
```

Las migraciones están en `alembic/versions/`. Cada archivo tiene `upgrade()` y `downgrade()`.

## Dockerfile del backend

```dockerfile
# Multi-stage build con Poetry 2.0+
FROM python:3.12-slim
WORKDIR /app
RUN pip install poetry
COPY pyproject.toml poetry.lock ./
RUN poetry install --without dev --no-root
COPY . .
```

> **Nota:** Poetry 2.0+ usa `--without dev` (no `--no-dev`). Ver [bugfix en engram](../openspec/).

## Dockerfile del frontend

Next.js con build estático. La `NEXT_PUBLIC_API_URL` se inyecta como build arg.

## Producción

Para un deploy productivo se recomienda:

1. **Base de datos:** PostgreSQL gestionado (AWS RDS, Supabase, etc.)
2. **Backend:** Container en servicio managed (Railway, Render, Fly.io)
3. **Frontend:** Vercel (nativo para Next.js) o container
4. **Secrets:** Variables de entorno inyectadas por el proveedor (no en `.env` en el repo)
5. **Migraciones:** Ejecutar `alembic upgrade head` como paso del deploy pipeline

### Variables de entorno en producción

```ini
DATABASE_URL=postgresql+asyncpg://user:pass@prod-host:5432/radar_db
APOLLO_API_KEY=live_key_here
GEMINI_API_KEY=live_key_here
DEBUG=false
CORS_ORIGINS=["https://radar.tudominio.com"]
```

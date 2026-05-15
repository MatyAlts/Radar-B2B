# Primeros Pasos

## Pre-requisitos

- Docker Desktop (recomendado) **o** Python 3.12+ y Node.js 20+
- Credenciales de Apollo.io API
- Credenciales de Google Gemini API

## Configuración de entorno

Copiá el archivo de ejemplo y completá las variables:

```bash
cp .env.example .env
```

```ini
# .env
DATABASE_URL=postgresql+asyncpg://radar:radar_dev_password@localhost:15432/radar_db

# APIs externas (obligatorias)
APOLLO_API_KEY=tu_api_key_de_apollo
GEMINI_API_KEY=tu_api_key_de_gemini

# Opcionales
DEBUG=true
API_PREFIX=/api/v1
SCHEDULER_ENABLED=true
SICOES_UPDATE_INTERVAL_HOURS=6
```

## Opción A — Docker Compose (recomendado)

```bash
# Levantar todos los servicios
docker compose up -d

# Ver logs
docker compose logs -f

# Apagar
docker compose down
```

Servicios disponibles:

| Servicio | URL | Descripción |
|----------|-----|-------------|
| Frontend | http://localhost:13000 | Dashboard Next.js |
| Backend API | http://localhost:18000 | FastAPI REST |
| API Docs | http://localhost:18000/api/v1/docs | Swagger UI |
| ReDoc | http://localhost:18000/api/v1/redoc | ReDoc |
| PostgreSQL | localhost:15432 | Base de datos |

### Ejecutar migraciones (primera vez)

```bash
docker compose exec api alembic upgrade head
```

### Poblar datos iniciales (seed)

```bash
docker compose exec api python scripts/seed_db.py
```

## Opción B — Local (sin Docker)

### Backend

```bash
# Instalar dependencias (requiere Poetry)
poetry install

# Activar entorno virtual
poetry shell

# Asegurate de tener PostgreSQL corriendo y la DATABASE_URL apuntando a localhost
# Ejecutar migraciones
alembic upgrade head

# Iniciar servidor
uvicorn src.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar la URL del backend
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Iniciar en desarrollo
npm run dev
```

Frontend disponible en http://localhost:3000.

## Verificar que todo funciona

```bash
# Health check del backend
curl http://localhost:18000/api/v1/health
# Esperado: {"status":"ok","service":"radar-b2b-api"}

# Listar empresas
curl http://localhost:18000/api/v1/companies
```

## Testing

### Backend

```bash
# Correr tests unitarios
poetry run pytest tests/unit/ -v

# Correr tests de integración (requiere DB)
poetry run pytest tests/integration/ -v

# Todos los tests con cobertura
poetry run pytest --cov=src
```

### Frontend

```bash
cd frontend

# Tests unitarios (Vitest)
npm test

# Tests E2E (Playwright) — requiere el backend corriendo
npm run test:e2e
```

## Sincronizar empresas desde Apollo

Una vez que el sistema está corriendo, podés importar empresas:

```bash
# Via API
curl -X POST http://localhost:18000/api/v1/companies/sync \
  -H "Content-Type: application/json" \
  -d '{"industries": ["Mining", "Logistics"], "locations": ["Bolivia"]}'

# O desde el Dashboard → botón "Sincronizar" en el Radar
```

# Arquitectura del Sistema

## Visión General

Radar B2B Inteligente sigue **Clean Architecture** (también conocida como Hexagonal/Ports & Adapters). El dominio de negocio es independiente de frameworks, bases de datos y servicios externos.

## Capas

```
src/
├── domain/              ← Capa de Dominio (núcleo — sin dependencias externas)
│   ├── entities/        ← Entidades de negocio (Company, Contact, Signal, Tender)
│   ├── interfaces/      ← Contratos/Puertos (repositorios abstractos)
│   └── scoring.py       ← Lógica pura de scoring (CompanySignals, calculate_score)
│
├── services/            ← Capa de Aplicación (casos de uso)
│   ├── company_service.py
│   ├── contact_service.py
│   ├── signal_service.py
│   └── scoring_service.py
│
├── infrastructure/      ← Capa de Infraestructura (adaptadores)
│   ├── db/              ← SQLAlchemy models, repositories, session
│   │   ├── models/      ← ORM models (Company, Contact, Signal, Tender)
│   │   ├── repositories/ ← Implementaciones concretas de los repos
│   │   └── session.py   ← AsyncSession factory
│   ├── apollo/          ← Cliente HTTP para Apollo.io
│   │   └── client.py
│   ├── sicoes/          ← Scraper SICOES (scraper.py — check_company_participation)
│   └── ai/              ← Cliente Gemini para justificaciones
│       └── gemini_client.py
│
└── api/                 ← Capa de Presentación (FastAPI)
    ├── routers/         ← Endpoints HTTP (companies, signals)
    ├── schemas/         ← Pydantic schemas para validación y serialización
    └── main.py          ← Bootstrap de la aplicación
```

## Diagrama de dependencias

```
API (FastAPI)
    │
    ▼
Services (casos de uso)
    │           │
    ▼           ▼
Domain      Infrastructure
(entities,  (DB, Apollo, AI)
 scoring)
```

Las capas externas dependen de las internas. **Nunca al revés.**

## Entidades de Dominio

### Company

Entidad principal. Contiene 6 señales booleanas que alimentan el scoring.

```python
@dataclass
class Company:
    id: Optional[str]
    name: str
    industry: Optional[str]
    city: Optional[str]
    country: str = "Bolivia"
    employee_count: Optional[int]
    website: Optional[str]
    apollo_id: Optional[str]

    # Señales de scoring
    strategic_sector: bool = False   # +20 pts
    recent_growth: bool = False      # +15 pts
    sicoes_participation: bool = False  # +20 pts
    adequate_size: bool = False      # +10 pts
    decision_maker_found: bool = False  # +15 pts
    purchase_signal: bool = False    # +20 pts

    # Resultado
    score: int = 0
    temperature: str = "frío"
    score_justification: Optional[str] = None
```

### Contact

Decisores de una empresa: CEO, Gerente de Compras, etc.

```python
@dataclass
class Contact:
    id: Optional[str]
    company_id: str
    name: str
    title: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    linkedin_url: Optional[str]
    apollo_id: Optional[str]
    confidence_score: float = 0.5
```

### Signal

Señal de mercado detectada (noticia, licitación, etc.).

```python
@dataclass
class Signal:
    id: Optional[str]
    company_id: str
    source: str       # "sicoes" | "news" | "apollo"
    signal_type: str  # "expansion" | "licitacion" | "inversion" | ...
    content: str
    relevance_score: float
    summary: Optional[str]
```

## Patrón Repository

Los repositorios implementan la interfaz del dominio. El dominio solo conoce la abstracción.

```python
# domain/interfaces/repositories.py
class CompanyRepositoryInterface(ABC):
    @abstractmethod
    async def get_by_id(self, id: str) -> Optional[Company]: ...
    @abstractmethod
    async def list(self, skip: int, limit: int, ...) -> tuple[list[Company], int]: ...
    @abstractmethod
    async def create(self, company: Company) -> Company: ...
    @abstractmethod
    async def update(self, company: Company) -> Company: ...
    @abstractmethod
    async def delete(self, id: str) -> bool: ...
```

## Base de Datos

PostgreSQL 15 con SQLAlchemy async (asyncpg driver). Migraciones con Alembic.

```
Tables:
├── companies     ← Empresas con señales y scores
├── contacts      ← Decisores por empresa
├── signals       ← Señales de mercado detectadas
└── tenders       ← Licitaciones de SICOES
```

## Decisiones de diseño clave

Todas las decisiones están en [adr.md](./adr.md).

| Decisión | Elección | Razón |
|----------|----------|-------|
| Arquitectura | Clean Architecture | Testabilidad, intercambiabilidad de infra |
| ORM | SQLAlchemy async | Soporte nativo async con FastAPI |
| HTTP client | httpx async | Consistencia async, soporte para retry |
| AI | Gemini (Google) | Costo-beneficio vs OpenAI para caso de uso |
| State mgmt (FE) | Zustand + TanStack Query | Server state separado de UI state |

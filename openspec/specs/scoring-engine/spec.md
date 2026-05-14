## ADDED Requirements

### Requirement: Cálculo de score determinista (0-100)
El sistema SHALL calcular el score de cada empresa usando pesos fijos y señales booleanas. El cálculo MUST ser determinista: mismas señales = mismo score siempre.

Tabla de pesos:
| Señal                        | Puntos |
|------------------------------|--------|
| Sector estratégico           | +20    |
| Crecimiento/noticias recientes | +15  |
| Participación en licitaciones| +20    |
| Tamaño adecuado (50-500 emp) | +10    |
| Decisor encontrado           | +15    |
| Señal de compra detectada    | +20    |
| **Total máximo**             | **100**|

#### Scenario: Score con todas las señales activas
- **WHEN** una empresa tiene todas las señales en `true`
- **THEN** el score calculado es exactamente 100

#### Scenario: Score con ninguna señal
- **WHEN** una empresa no tiene ninguna señal activa
- **THEN** el score calculado es 0

#### Scenario: Score parcial
- **WHEN** una empresa tiene `strategic_sector=true` y `decision_maker_found=true` únicamente
- **THEN** el score es 35 (20 + 15)

### Requirement: Clasificación por temperatura
El sistema SHALL clasificar cada empresa en una categoría de temperatura basada en su score.

#### Scenario: Empresa caliente
- **WHEN** el score de una empresa es ≥ 70
- **THEN** `temperature = "caliente"`

#### Scenario: Empresa tibia
- **WHEN** el score está entre 40 y 69 (inclusive)
- **THEN** `temperature = "tibio"`

#### Scenario: Empresa fría
- **WHEN** el score es < 40
- **THEN** `temperature = "frio"`

### Requirement: Justificación por Claude API
El sistema SHALL generar una justificación en lenguaje natural del score usando Claude API. La generación es asíncrona y no bloquea el endpoint de scoring.

#### Scenario: Justificación generada
- **WHEN** el score de una empresa es calculado
- **THEN** se encola una tarea background para llamar a Claude API y guardar la justificación en el campo `score_justification` de la empresa

#### Scenario: Claude API falla
- **WHEN** Claude API retorna error o timeout
- **THEN** el score se persiste igualmente, `score_justification` queda en `null`, y se registra el error en logs

#### Scenario: Justificación disponible en API
- **WHEN** se llama `GET /api/v1/companies/{company_id}/score`
- **THEN** retorna: score, temperature, señales activas (breakdown), justification (puede ser null si aún no se generó)

### Requirement: Recálculo de score ante cambio de señales
El sistema SHALL recalcular el score automáticamente cada vez que cambia alguna señal de la empresa (nuevo decisor, nueva licitación, etc.).

#### Scenario: Recálculo por nueva señal
- **WHEN** se activa una nueva señal en una empresa (ej: `decision_maker_found` pasa a `true`)
- **THEN** el sistema recalcula el score inmediatamente y actualiza `score` y `temperature` en la base de datos

# Motor de Scoring

## Concepto

Cada empresa recibe un **score de 0 a 100** basado en 6 señales booleanas. El score determina la **temperatura** (prioridad comercial) y se complementa con una **justificación en lenguaje natural** generada por IA.

## Señales y pesos

| Señal | Campo | Puntos | Descripción |
|-------|-------|--------|-------------|
| Sector estratégico | `strategic_sector` | +20 | Empresa en Mining, Logistics, Agro, Industrial o Warehousing |
| Crecimiento reciente | `recent_growth` | +15 | Noticias de expansión, nuevas plantas, inversiones |
| Participación SICOES | `sicoes_participation` | +20 | Aparece en licitaciones públicas de Bolivia |
| Tamaño adecuado | `adequate_size` | +10 | Entre 10 y ~500 empleados (perfil comprador ideal) |
| Decisor encontrado | `decision_maker_found` | +15 | CEO, Gerente de Compras, etc. identificado en Apollo |
| Señal de compra | `purchase_signal` | +20 | Indicio directo de intención de compra |

**Suma máxima:** 100 puntos

## Temperatura

| Score | Temperatura | Significado |
|-------|-------------|-------------|
| 70–100 | 🔴 Caliente | Alta prioridad — contactar inmediatamente |
| 40–69 | 🟡 Tibio | Potencial — vale la pena investigar |
| 0–39 | 🔵 Frío | Bajo potencial actual |

## Implementación

```python
# src/domain/scoring.py

SCORING_WEIGHTS = {
    "strategic_sector": 20,
    "recent_growth": 15,
    "sicoes_participation": 20,
    "adequate_size": 10,
    "decision_maker_found": 15,
    "purchase_signal": 20,
}

def calculate_score(signals: CompanySignals) -> int:
    score = 0
    for signal, weight in SCORING_WEIGHTS.items():
        if getattr(signals, signal):
            score += weight
    return min(score, 100)

def determine_temperature(score: int) -> str:
    if score >= 70:
        return "caliente"
    elif score >= 40:
        return "tibio"
    return "frío"
```

## Justificación con IA (Gemini)

Cuando Gemini está disponible, se genera una explicación en lenguaje natural del score.

**Prompt enviado a Gemini:**
```
Sos un analista comercial B2B experto en mercados industriales de Bolivia.
Generá una justificación concisa (2-3 oraciones) del score comercial de la siguiente empresa.

Empresa: {nombre}
Industria: {industria}
Score: {score}/100
Temperatura: {temperatura}
Señales positivas: {lista de señales activas}
Señales ausentes: {lista de señales inactivas}
```

**Ejemplo de output:**
```
"Empresa del sector minero con alta prioridad comercial. Tiene participación activa 
en licitaciones SICOES y se identificó al Gerente de Compras con datos de contacto. 
Para maximizar el score, se recomienda detectar señales directas de expansión o compra."
```

**Fallback (sin Gemini):** Se genera una justificación determinista basada en las señales activas.

## Cuándo se recalcula el score

El score se recalcula automáticamente en estos eventos:

1. **Enriquecimiento** (`POST /companies/{id}/enrich`) — después de actualizar señales desde Apollo
2. **Recálculo manual** (`POST /companies/{id}/score`) — fuerza el recálculo sin re-enriquecer
3. **Actualización de señales** — si se modifica manualmente alguna señal booleana

## Cómo mejorar el score de una empresa

| Acción | Señal que activa | Puntos ganados |
|--------|-----------------|----------------|
| Enriquecer con dominio web | `decision_maker_found` (si encuentra decisores) | +15 |
| Detectar licitación SICOES | `sicoes_participation` | +20 |
| Registrar noticia de expansión | `recent_growth` | +15 |
| Validar sector como estratégico | `strategic_sector` | +20 |
| Confirmar señal de compra | `purchase_signal` | +20 |

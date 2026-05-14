from dataclasses import dataclass


@dataclass
class CompanySignals:
    """Agrupa todas las señales de una empresa para el cálculo de score."""

    strategic_sector: bool = False
    recent_growth: bool = False
    sicoes_participation: bool = False
    adequate_size: bool = False
    decision_maker_found: bool = False
    purchase_signal: bool = False


# Pesos definidos para cada señal (suma = 100)
SCORING_WEIGHTS = {
    "strategic_sector": 20,
    "recent_growth": 15,
    "sicoes_participation": 20,
    "adequate_size": 10,
    "decision_maker_found": 15,
    "purchase_signal": 20,
}


def calculate_score(signals: CompanySignals) -> int:
    """
    Calcula el score de una empresa (0-100) basado en sus señales.

    Args:
        signals: Objeto CompanySignals con los flags booleanos

    Returns:
        Score entero entre 0 y 100
    """
    score = 0
    if signals.strategic_sector:
        score += SCORING_WEIGHTS["strategic_sector"]
    if signals.recent_growth:
        score += SCORING_WEIGHTS["recent_growth"]
    if signals.sicoes_participation:
        score += SCORING_WEIGHTS["sicoes_participation"]
    if signals.adequate_size:
        score += SCORING_WEIGHTS["adequate_size"]
    if signals.decision_maker_found:
        score += SCORING_WEIGHTS["decision_maker_found"]
    if signals.purchase_signal:
        score += SCORING_WEIGHTS["purchase_signal"]

    return min(score, 100)  # Garantizar máximo 100


def determine_temperature(score: int) -> str:
    """Determina la temperatura basada en el score."""
    if score >= 70:
        return "hot"
    elif score >= 40:
        return "warm"
    return "cold"

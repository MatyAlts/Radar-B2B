import pytest
from src.domain.entities.company import Company
from src.domain.scoring import calculate_score, CompanySignals


def test_calculate_score_no_signals():
    """Empresa sin señales debe tener score 0."""
    signals = CompanySignals()
    score = calculate_score(signals)
    assert score == 0


def test_calculate_score_strategic_sector():
    """Sector estratégico suma 20 puntos."""
    signals = CompanySignals(strategic_sector=True)
    score = calculate_score(signals)
    assert score == 20


def test_calculate_score_recent_growth():
    """Crecimiento reciente suma 15 puntos."""
    signals = CompanySignals(recent_growth=True)
    score = calculate_score(signals)
    assert score == 15


def test_calculate_score_sicoes_participation():
    """Participación en SICOES suma 20 puntos."""
    signals = CompanySignals(sicoes_participation=True)
    score = calculate_score(signals)
    assert score == 20


def test_calculate_score_adequate_size():
    """Tamaño adecuado suma 10 puntos."""
    signals = CompanySignals(adequate_size=True)
    score = calculate_score(signals)
    assert score == 10


def test_calculate_score_decision_maker_found():
    """Decisor encontrado suma 15 puntos."""
    signals = CompanySignals(decision_maker_found=True)
    score = calculate_score(signals)
    assert score == 15


def test_calculate_score_purchase_signal():
    """Señal de compra suma 20 puntos."""
    signals = CompanySignals(purchase_signal=True)
    score = calculate_score(signals)
    assert score == 20


def test_calculate_score_all_signals():
    """Todos los signals suman 100 puntos."""
    signals = CompanySignals(
        strategic_sector=True,
        recent_growth=True,
        sicoes_participation=True,
        adequate_size=True,
        decision_maker_found=True,
        purchase_signal=True,
    )
    score = calculate_score(signals)
    assert score == 100


def test_calculate_score_partial_signals():
    """Combinación parcial suma correctamente."""
    signals = CompanySignals(
        strategic_sector=True,
        recent_growth=True,
        adequate_size=True,
    )
    score = calculate_score(signals)
    assert score == 45  # 20 + 15 + 10

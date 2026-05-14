from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.infrastructure.db.session import get_session
from src.services.signal_service import SignalService
from src.api.schemas.signal import SignalCreate, SignalResponse

router = APIRouter(prefix="/companies", tags=["signals"])


@router.get("/{company_id}/signals", response_model=list[SignalResponse])
async def list_signals(
    company_id: str,
    session: AsyncSession = Depends(get_session),
):
    """Lista señales de una empresa."""
    service = SignalService(session)
    signals = await service.get_company_signals(company_id)
    return signals


@router.post("/{company_id}/signals", response_model=SignalResponse)
async def create_signal(
    company_id: str,
    signal: SignalCreate,
    session: AsyncSession = Depends(get_session),
):
    """Registra una nueva señal de compra."""
    service = SignalService(session)

    result = await service.register_signal(
        company_id=company_id,
        signal_type=signal.signal_type,
        source=signal.source,
        description=signal.description,
        relevance=signal.relevance,
    )

    return result

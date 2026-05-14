from abc import ABC, abstractmethod
from typing import List, Optional
from src.domain.entities.company import Company
from src.domain.entities.contact import Contact
from src.domain.entities.signal import CompanySignal
from src.domain.entities.tender import Tender


class CompanyRepository(ABC):
    """Interfaz para el repositorio de empresas."""

    @abstractmethod
    async def get_by_id(self, company_id: str) -> Optional[Company]:
        """Obtiene una empresa por ID."""
        pass

    @abstractmethod
    async def create(self, company: Company) -> Company:
        """Crea una nueva empresa."""
        pass

    @abstractmethod
    async def update(self, company: Company) -> Company:
        """Actualiza una empresa existente."""
        pass

    @abstractmethod
    async def list(
        self, skip: int = 0, limit: int = 10, industry: Optional[str] = None
    ) -> tuple[List[Company], int]:
        """Lista empresas con paginación y filtros."""
        pass

    @abstractmethod
    async def delete(self, company_id: str) -> bool:
        """Elimina una empresa."""
        pass


class ContactRepository(ABC):
    """Interfaz para el repositorio de contactos."""

    @abstractmethod
    async def get_by_id(self, contact_id: str) -> Optional[Contact]:
        """Obtiene un contacto por ID."""
        pass

    @abstractmethod
    async def create(self, contact: Contact) -> Contact:
        """Crea un nuevo contacto."""
        pass

    @abstractmethod
    async def list_by_company(self, company_id: str) -> List[Contact]:
        """Lista contactos de una empresa."""
        pass

    @abstractmethod
    async def upsert(self, contact: Contact) -> Contact:
        """Crea o actualiza un contacto."""
        pass


class SignalRepository(ABC):
    """Interfaz para el repositorio de señales."""

    @abstractmethod
    async def create(self, signal: CompanySignal) -> CompanySignal:
        """Crea una nueva señal."""
        pass

    @abstractmethod
    async def list_by_company(self, company_id: str) -> List[CompanySignal]:
        """Lista señales de una empresa."""
        pass


class TenderRepository(ABC):
    """Interfaz para el repositorio de licitaciones."""

    @abstractmethod
    async def get_by_id(self, tender_id: str) -> Optional[Tender]:
        """Obtiene una licitación por ID."""
        pass

    @abstractmethod
    async def create(self, tender: Tender) -> Tender:
        """Crea una nueva licitación."""
        pass

    @abstractmethod
    async def upsert(self, tender: Tender) -> Tender:
        """Crea o actualiza una licitación."""
        pass

    @abstractmethod
    async def list_active(self, limit: int = 100) -> List[Tender]:
        """Lista licitaciones activas."""
        pass

    @abstractmethod
    async def list_by_company(self, company_id: str) -> List[Tender]:
        """Lista licitaciones relacionadas a una empresa."""
        pass

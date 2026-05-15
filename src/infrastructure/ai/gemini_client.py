import logging
from google import genai
from google.genai import types

from src.domain.entities.company import Company
from src.domain.scoring import CompanySignals

logger = logging.getLogger(__name__)

_MODEL = "gemini-3.1-flash-lite"


class GeminiClient:
    def __init__(self, api_key: str):
        self._client = genai.Client(api_key=api_key)

    async def generate_score_justification(self, company: Company, signals: CompanySignals) -> str:
        """Genera una justificación en lenguaje natural del score de una empresa."""
        signal_labels = {
            "strategic_sector": "sector estratégico",
            "recent_growth": "crecimiento reciente",
            "sicoes_participation": "participación en licitaciones SICOES",
            "adequate_size": "tamaño adecuado",
            "decision_maker_found": "decisor clave identificado",
            "purchase_signal": "señal de compra detectada",
        }

        active_text = ", ".join(
            signal_labels[k] for k, v in signals.__dict__.items() if v and k in signal_labels
        )
        inactive_text = ", ".join(
            signal_labels[k] for k, v in signals.__dict__.items() if not v and k in signal_labels
        )

        prompt = f"""Sos un analista comercial B2B experto en mercados industriales de Bolivia.
Generá una justificación concisa (2-3 oraciones) del score comercial de la siguiente empresa.
Sé específico, directo y útil para un vendedor.

Empresa: {company.name}
Industria: {company.industry or "no especificada"}
Score: {company.score}/100
Temperatura: {company.temperature}
Señales positivas: {active_text or "ninguna"}
Señales ausentes: {inactive_text or "ninguna"}

Respondé solo la justificación, sin títulos ni listas."""

        try:
            response = await self._client.aio.models.generate_content(
                model=_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(max_output_tokens=200),
            )
            return response.text.strip()
        except Exception as e:
            logger.warning(f"Gemini justification failed for {company.name}: {e}")
            return self._fallback_justification(company, active_text)

    async def analyze_signal(self, company_name: str, signal_text: str, source: str) -> dict:
        """Analiza una señal de compra y retorna tipo, relevancia y resumen."""
        prompt = f"""Sos un analista comercial B2B. Analizá esta señal de mercado sobre una empresa.

Empresa: {company_name}
Fuente: {source}
Texto: {signal_text}

Respondé en este formato exacto (sin markdown):
tipo: [expansion|licitacion|inversion|contratacion|otro]
relevancia: [0.0 a 1.0]
resumen: [1 oración explicando la señal en términos comerciales]"""

        try:
            response = await self._client.aio.models.generate_content(
                model=_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(max_output_tokens=150),
            )
            return self._parse_signal_response(response.text)
        except Exception as e:
            logger.warning(f"Gemini signal analysis failed: {e}")
            return {"tipo": "otro", "relevancia": 0.5, "resumen": signal_text[:200]}

    def _parse_signal_response(self, text: str) -> dict:
        result = {"tipo": "otro", "relevancia": 0.5, "resumen": ""}
        for line in text.strip().splitlines():
            if line.startswith("tipo:"):
                result["tipo"] = line.split(":", 1)[1].strip()
            elif line.startswith("relevancia:"):
                try:
                    result["relevancia"] = float(line.split(":", 1)[1].strip())
                except ValueError:
                    pass
            elif line.startswith("resumen:"):
                result["resumen"] = line.split(":", 1)[1].strip()
        return result

    def _fallback_justification(self, company: Company, active_text: str) -> str:
        name = company.name or "La empresa"
        if active_text:
            return f"{name} obtuvo {company.score}/100 ({company.temperature}) gracias a: {active_text}."
        return f"{name} obtuvo {company.score}/100 ({company.temperature}). No se detectaron señales positivas."

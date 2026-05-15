"""
Script para mantener la documentacion sincronizada con el codigo.

Actualiza automaticamente las secciones generables de /docs:
- scoring-engine.md: pesos del scoring desde src/domain/scoring.py

Uso:
    python scripts/update_docs.py
    python scripts/update_docs.py --section scoring
"""
import argparse
import ast
from pathlib import Path

ROOT = Path(__file__).parent.parent
DOCS = ROOT / "docs"


def extract_scoring_weights() -> dict:
    """Lee los pesos de scoring directamente del codigo fuente."""
    scoring_file = ROOT / "src" / "domain" / "scoring.py"
    tree = ast.parse(scoring_file.read_text(encoding="utf-8"))

    for node in ast.walk(tree):
        if isinstance(node, ast.Assign):
            for target in node.targets:
                if isinstance(target, ast.Name) and target.id == "SCORING_WEIGHTS":
                    if isinstance(node.value, ast.Dict):
                        return {
                            k.value: v.value
                            for k, v in zip(node.value.keys, node.value.values)
                        }
    return {}


def update_scoring_section():
    """Actualiza la tabla de pesos en scoring-engine.md con los valores reales del codigo."""
    weights = extract_scoring_weights()
    if not weights:
        print("WARN: No se pudieron extraer los pesos del scoring.")
        return

    signal_descriptions = {
        "strategic_sector": ("Sector estrategico", "`strategic_sector`", "Mining, Logistics, Agro, Industrial o Warehousing"),
        "recent_growth": ("Crecimiento reciente", "`recent_growth`", "Noticias de expansion, nuevas plantas, inversiones"),
        "sicoes_participation": ("Participacion SICOES", "`sicoes_participation`", "Aparece en licitaciones publicas de Bolivia"),
        "adequate_size": ("Tamano adecuado", "`adequate_size`", "Entre 10 y ~500 empleados (perfil comprador ideal)"),
        "decision_maker_found": ("Decisor encontrado", "`decision_maker_found`", "CEO, Gerente de Compras, etc. identificado en Apollo"),
        "purchase_signal": ("Senal de compra", "`purchase_signal`", "Indicio directo de intencion de compra"),
    }

    table_rows = []
    for key, pts in weights.items():
        if key in signal_descriptions:
            label, field, desc = signal_descriptions[key]
            table_rows.append(f"| {label} | {field} | +{pts} | {desc} |")

    table = (
        "| Signal | Campo | Puntos | Descripcion |\n"
        "|--------|-------|--------|-------------|\n"
        + "\n".join(table_rows)
    )

    scoring_file = DOCS / "scoring-engine.md"
    content = scoring_file.read_text(encoding="utf-8")

    start_marker = "## Senales y pesos\n"
    end_marker = "\n## Temperatura"

    start = content.find(start_marker)
    end = content.find(end_marker)

    if start != -1 and end != -1:
        new_content = (
            content[:start + len(start_marker)]
            + "\n"
            + table
            + "\n\n**Suma maxima:** "
            + str(sum(weights.values()))
            + " puntos\n"
            + content[end:]
        )
        scoring_file.write_text(new_content, encoding="utf-8")
        print(f"OK scoring-engine.md actualizado (suma={sum(weights.values())})")
    else:
        # Fallback: just report weights found
        print(f"OK Pesos extraidos: {weights}")


def update_api_endpoints():
    """Verifica que el backend esta corriendo y reporta endpoints."""
    try:
        import httpx
        response = httpx.get("http://localhost:18000/api/v1/openapi.json", timeout=5)
        spec = response.json()
        paths = list(spec.get("paths", {}).keys())
        print(f"OK {len(paths)} endpoints en OpenAPI spec")
        print("   Swagger UI: http://localhost:18000/api/v1/docs")
    except Exception:
        print("WARN: No se pudo conectar al backend. Levantalo con: docker compose up -d")


def main():
    parser = argparse.ArgumentParser(description="Actualizar documentacion de Radar B2B")
    parser.add_argument(
        "--section",
        choices=["all", "api", "scoring"],
        default="all",
        help="Seccion a actualizar",
    )
    args = parser.parse_args()

    print(f"Actualizando documentacion (seccion: {args.section})...")

    if args.section in ("all", "scoring"):
        update_scoring_section()

    if args.section in ("all", "api"):
        update_api_endpoints()

    print("Documentacion actualizada en /docs")


if __name__ == "__main__":
    main()

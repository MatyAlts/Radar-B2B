## 1. Investigación previa (bloqueante)

- [x] 1.1 Inspeccionar manualmente `sicoes.gob.bo` y documentar la URL del formulario de búsqueda por empresa adjudicada
- [x] 1.2 Identificar los parámetros GET/POST que acepta el formulario de búsqueda
- [x] 1.3 Verificar si el sitio requiere cookies de sesión o token CSRF antes de buscar
- [x] 1.4 Identificar el selector HTML donde aparecen los resultados (tabla, lista, etc.)

## 2. Dependencias

- [x] 2.1 Agregar `beautifulsoup4` a `requirements.txt` (o `pyproject.toml`)

## 3. SicoesScraper — TDD

- [x] 3.1 Escribir tests unitarios en `tests/unit/test_sicoes_scraper.py` mockeando httpx: empresa encontrada → True, no encontrada → False, timeout → False, error HTTP → False
- [x] 3.2 Implementar `src/infrastructure/sicoes/scraper.py` con clase `SicoesScraper` y método async `check_company_participation(company_name: str) -> bool`
- [x] 3.3 Implementar función privada `_normalize_name(name: str) -> str` que elimina sufijos legales (S.R.L., S.A., SRL, SA, LTDA) y convierte a mayúsculas
- [x] 3.4 Implementar lógica de timeout (10s) y fallback silencioso a `False` con log
- [x] 3.5 Verificar que todos los tests del paso 3.1 pasan

## 4. Integración en CompanyService

- [x] 4.1 Escribir test unitario en `tests/unit/test_company_service.py` para el nuevo método `enrich_sicoes`: verifica que actualiza `sicoes_participation` y recalcula score
- [x] 4.2 Agregar método `async enrich_sicoes(self, company_id: str) -> Company` en `src/services/company_service.py`
- [x] 4.3 El método debe: obtener empresa por ID → llamar al scraper → actualizar `sicoes_participation` → recalcular score → persistir → retornar empresa actualizada
- [x] 4.4 Verificar que el test del paso 4.1 pasa

## 5. Script de ejecución manual

- [x] 5.1 Crear `scripts/sync_sicoes.py` que itera todas las empresas de la DB y llama `enrich_sicoes` para cada una, con delay de 1s entre requests
- [x] 5.2 Agregar logging de progreso: cuántas empresas procesadas, cuántas con `sicoes_participation=True`

## 6. Verificación final

- [x] 6.1 Ejecutar `pytest tests/unit/test_sicoes_scraper.py tests/unit/test_company_service.py` — todos deben pasar
- [ ] 6.2 Ejecutar `scripts/sync_sicoes.py` manualmente contra una empresa conocida y verificar que el flag se actualiza correctamente en la DB

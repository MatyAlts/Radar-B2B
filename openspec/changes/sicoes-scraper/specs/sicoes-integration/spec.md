## MODIFIED Requirements

### Requirement: Cruce empresa-licitación
El sistema SHALL determinar si una empresa del radar tiene participación en licitaciones SICOES. Para el MVP, la verificación se realiza on-demand por nombre de empresa usando el scraper, sin persistir las licitaciones individuales. El campo `sicoes_participation` de la empresa MUST actualizarse tras cada verificación exitosa.

#### Scenario: Empresa encontrada en SICOES — flag activado
- **WHEN** `CompanyService.enrich_sicoes(company_id)` se ejecuta y SICOES confirma participación
- **THEN** `company.sicoes_participation` pasa a `True`, el score se recalcula y `temperature` se actualiza

#### Scenario: Empresa no encontrada en SICOES — flag desactivado
- **WHEN** `CompanyService.enrich_sicoes(company_id)` se ejecuta y SICOES no encuentra la empresa
- **THEN** `company.sicoes_participation` permanece en `False`, score no cambia

#### Scenario: Error al consultar SICOES — sin cambio de estado
- **WHEN** el scraper falla por timeout o error HTTP
- **THEN** `company.sicoes_participation` NO se modifica, el error se registra en logs, el flow no falla

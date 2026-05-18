## ADDED Requirements

### Requirement: Verificación de participación en SICOES por nombre de empresa
El sistema SHALL consultar el portal SICOES y determinar si una empresa aparece como adjudicada en procesos de contratación pública bolivianos. El resultado SHALL ser un valor booleano.

#### Scenario: Empresa encontrada en adjudicaciones
- **WHEN** se invoca `SicoesScraper.check_company_participation("ACSA Bolivia SRL")`
- **THEN** el scraper retorna `True`

#### Scenario: Empresa no encontrada
- **WHEN** se invoca `check_company_participation` con un nombre que no aparece en SICOES
- **THEN** el scraper retorna `False`

#### Scenario: SICOES no responde (timeout)
- **WHEN** el portal SICOES no responde dentro de 10 segundos
- **THEN** el scraper retorna `False` sin lanzar excepción, y registra el evento en logs

#### Scenario: SICOES retorna error HTTP
- **WHEN** el portal SICOES retorna un código HTTP 4xx o 5xx
- **THEN** el scraper retorna `False` sin lanzar excepción, y registra el código de error en logs

### Requirement: Normalización de nombre antes de búsqueda
El sistema SHALL normalizar el nombre de la empresa antes de enviarlo a SICOES, eliminando sufijos legales comunes y diferencias de capitalización.

#### Scenario: Normalización de sufijos legales
- **WHEN** el nombre contiene "S.R.L.", "S.A.", "SRL", "SA", "LTDA" al final
- **THEN** la búsqueda en SICOES se realiza sin ese sufijo

#### Scenario: Normalización de capitalización
- **WHEN** el nombre tiene capitalización mixta (ej: "Acsa Bolivia")
- **THEN** la búsqueda se realiza en mayúsculas para maximizar coincidencias en SICOES

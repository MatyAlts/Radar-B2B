## ADDED Requirements

### Requirement: Función listContacts en el cliente API
El cliente API SHALL exportar una función `listContacts(companyId: string): Promise<Contact[]>` que consume `GET /api/v1/companies/{id}/contacts`.

#### Scenario: Request exitoso
- **WHEN** se llama `api.contacts.list("company-123")`
- **THEN** retorna un array tipado `Contact[]` con todos los contactos de esa empresa

#### Scenario: Empresa sin contactos
- **WHEN** la empresa no tiene contactos
- **THEN** retorna array vacío `[]` (no lanza error)

### Requirement: Función enrichCompany en el cliente API
El cliente API SHALL exportar una función `enrichCompany(companyId: string): Promise<void>` que dispara `POST /api/v1/companies/enrich` con el id de la empresa.

#### Scenario: Enriquecimiento disparado
- **WHEN** se llama `api.companies.enrich("company-123")`
- **THEN** el backend recibe la solicitud y retorna 200 o 202; la función resuelve sin valor

#### Scenario: Empresa no encontrada
- **WHEN** el backend retorna 404
- **THEN** la función lanza `ApiError` con status 404

### Requirement: Tipos TypeScript Contact y ContactReliability
El módulo de tipos SHALL incluir: `Contact` (id, company_id, name, title, email?, linkedin_url?, phone?, reliability, last_updated_at) y `ContactReliability = "high" | "medium" | "low"`.

#### Scenario: Tipos disponibles para importar
- **WHEN** un componente importa `Contact` desde `@/lib/api/types`
- **THEN** TypeScript infiere correctamente todos los campos con sus tipos opcionales

### Requirement: Mock data para contacts
El modo mock SHALL incluir datos ficticios de contactos para al menos 3 empresas mock, con variedad de cargos y niveles de confiabilidad.

#### Scenario: Mock de contacts activado
- **WHEN** `NEXT_PUBLIC_API_MOCK=true` y se llama `api.contacts.list("company-001")`
- **THEN** retorna array de 2-4 contactos ficticios con datos bolivianos realistas

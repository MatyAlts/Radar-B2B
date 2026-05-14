## ADDED Requirements

### Requirement: Tarjeta visual de contacto con datos clave
El componente `ContactCard` SHALL mostrar la información de un contacto en formato compacto: nombre, cargo con badge de color por nivel, badge de confiabilidad, email copiable, botón de LinkedIn y teléfono.

Colores de cargo por nivel:
- Gerente General / CEO / Dueño / Director → badge azul (C-Level)
- Jefe de Compras / Gerente de Operaciones / CFO → badge verde (Manager)
- Otros → badge gris

#### Scenario: Contacto completo
- **WHEN** se renderiza un contacto con todos los campos
- **THEN** se muestran: nombre, cargo (badge azul/verde/gris según nivel), badge de confiabilidad, ícono de email, ícono de LinkedIn (link externo), ícono de teléfono

#### Scenario: Contacto con datos parciales
- **WHEN** un contacto no tiene email ni teléfono (solo LinkedIn)
- **THEN** los campos faltantes no se muestran (sin placeholders vacíos ni "N/A")

### Requirement: Email copiable al portapapeles
Al hacer click en el email de un contacto, SHALL copiarse al portapapeles y mostrarse confirmación visual mediante un toast.

#### Scenario: Click en email — copia exitosa
- **WHEN** el usuario hace click en el email de un contacto
- **THEN** el email se copia al portapapeles y aparece un toast "Email copiado" por 2 segundos

#### Scenario: Click en email — clipboard no disponible
- **WHEN** `navigator.clipboard` no está disponible (HTTP sin HTTPS)
- **THEN** el sistema usa `document.execCommand('copy')` como fallback; si también falla, muestra toast "No se pudo copiar, copiá manualmente: <email>"

### Requirement: Badge de confiabilidad del dato
Cada contacto SHALL mostrar un badge indicando la confiabilidad del dato según Apollo: Alta (verde), Media (amarillo), Baja (rojo/naranja).

#### Scenario: Confiabilidad alta
- **WHEN** `reliability = "high"`
- **THEN** se muestra badge verde con texto "Alta"

#### Scenario: Confiabilidad media
- **WHEN** `reliability = "medium"`
- **THEN** se muestra badge amarillo/ámbar con texto "Media"

#### Scenario: Confiabilidad baja
- **WHEN** `reliability = "low"`
- **THEN** se muestra badge naranja/rojo con texto "Baja"

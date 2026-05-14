## ADDED Requirements

### Requirement: Score visual con color por temperatura
Cada empresa en el listado SHALL mostrar su score numérico (0-100) con un badge o indicador visual color-coded según temperatura: rojo/naranja para caliente (≥70), amarillo para tibio (40-69), gris/azul para frío (<40).

#### Scenario: Empresa caliente
- **WHEN** una empresa tiene score ≥ 70
- **THEN** el badge de score muestra fondo rojo/naranja con texto blanco y label "Caliente"

#### Scenario: Empresa tibia
- **WHEN** una empresa tiene score entre 40 y 69
- **THEN** el badge muestra fondo amarillo/ámbar con label "Tibio"

#### Scenario: Empresa fría
- **WHEN** una empresa tiene score < 40
- **THEN** el badge muestra fondo gris/azul claro con label "Frío"

### Requirement: Íconos de señales activas
Cada fila de empresa SHALL mostrar íconos compactos indicando qué señales están activas. Solo se muestran las señales activas (true), no las inactivas.

Señales y sus íconos:
- Sector estratégico → ícono de estrella
- Crecimiento/noticias → ícono de tendencia ascendente
- Licitación SICOES → ícono de documento/contrato
- Decisor encontrado → ícono de persona/contacto
- Señal de compra → ícono de rayo/compra

#### Scenario: Empresa con múltiples señales activas
- **WHEN** una empresa tiene 3 señales activas
- **THEN** se muestran exactamente 3 íconos en la fila, con tooltip al hover indicando el nombre de la señal

#### Scenario: Empresa sin señales
- **WHEN** una empresa no tiene ninguna señal activa
- **THEN** no se muestran íconos, la celda queda vacía (sin dash ni placeholder)

### Requirement: Panel de detalle de empresa (expandible)
Al hacer click en una fila de empresa, SHALL mostrarse un panel lateral (drawer) con información extendida: descripción, justificación IA del score, breakdown de señales con puntos, y botones de acción.

#### Scenario: Abrir panel de detalle
- **WHEN** el usuario hace click en una fila de empresa
- **THEN** se abre un drawer lateral con: nombre, sector, ciudad, score, breakdown de señales (cada señal con su valor en puntos), y justificación de IA (o spinner si aún no está disponible)

#### Scenario: Justificación IA no disponible
- **WHEN** `score_justification` es null en la respuesta de la API
- **THEN** el panel muestra "Generando justificación..." con un spinner animado en esa sección

#### Scenario: Cerrar panel
- **WHEN** el usuario hace click fuera del drawer o en el botón de cerrar
- **THEN** el drawer se cierra y la URL vuelve al estado sin empresa seleccionada

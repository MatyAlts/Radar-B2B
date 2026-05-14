# Radar B2B Inteligente (Radar Comercial IA)

Plataforma que detecta empresas con alta probabilidad de compra en sectores como industria, logística, agro, minería y almacenamiento.

## Fuentes de Datos
- **Apollo.io**: Base principal para buscar y enriquecer empresas y contactos (decisores).
- **SICOES**: Procesos de contratación pública en Bolivia (convocatorias, adjudicaciones, contratos).
- **Prensa Industrial**: Scraping/monitoreo para detectar expansión, proyectos o inversiones.

## Stack Tecnológico (MVP recomendado)
- **Backend**: Python / FastAPI
- **Frontend**: React o Next.js
- **Base de Datos**: PostgreSQL
- **IA**: Para resumir noticias, clasificar empresas y justificar el scoring.

## Funcionalidades Core
1. **Detección de Empresas**: Búsqueda por industria, ubicación, tamaño, cruce con SICOES y lectura de noticias.
2. **Identificación de Decisores**: Enriquecimiento de cargos clave (Gerente General, Dueño, Jefe de Compras, Gerente de Operaciones, etc.) vía Apollo (email, LinkedIn, teléfono).
3. **Scoring Híbrido con IA (0-100)**:
   - Sector estratégico (+20)
   - Empresa con crecimiento/noticias recientes (+15)
   - Participación en licitaciones (+20)
   - Tamaño adecuado (+10)
   - Decisor encontrado (+15)
   - Señal de compra detectada (+20)
   - *La IA genera una justificación en lenguaje simple del puntaje obtenido.*
4. **Dashboard (5 pantallas)**:
   - Radar de empresas (lista, sector, score, etc.)
   - Leads y decisores (contactos clave)
   - Señales de compra (noticias, licitaciones)
   - Scoring y priorización (caliente, tibio, frío)
   - Reportes y seguimiento (responsables comerciales, acciones)
5. **Reportes Automáticos**: Reporte semanal por email o PDF.

## 🛠️ Instrucciones Especiales para Claude
**Documentación de Apollo:** Cuando necesites documentación de la API de Apollo, la podés scrapear con Firecrawl desde el siguiente enlace: https://docs.apollo.io/

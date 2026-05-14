Software: “Radar B2B Inteligente”

Una plataforma que detecta empresas con alta probabilidad de compra en sectores como industria, logística, agro, minería y almacenamiento, usando Apollo.io como base principal de contactos y empresas, más señales externas como SICOES y prensa industrial.

Apollo permite buscar personas, empresas y enriquecer datos vía API; por ejemplo, tiene endpoints de búsqueda de personas, búsqueda de organizaciones y enriquecimiento de empresas/contactos. SICOES publica información de procesos de contratación pública en Bolivia, incluyendo convocatorias, adjudicaciones y contratos.

Cómo funcionaría
Detección de empresas
Buscar empresas en Apollo por industria, ubicación, tamaño, keywords y tecnologías.
Cruzar con SICOES para detectar empresas que ganan licitaciones, participan en proyectos o compran ciertos bienes/servicios.
Leer noticias industriales para detectar expansión, nuevas plantas, inversiones, flotas, almacenes o proyectos.
Identificación de decisores
Encontrar cargos como:
Gerente General
Dueño / Founder
Jefe de Compras
Gerente de Operaciones
Jefe de Logística
Jefe de Mantenimiento
Gerente de Proyectos
Enriquecer con email, LinkedIn, teléfono y empresa desde Apollo.

Scoring híbrido con IA
Puntaje de 0 a 100:

Sector estratégico: +20
Empresa con crecimiento/noticias recientes: +15
Participación en licitaciones: +20
Tamaño de empresa adecuado: +10
Decisor encontrado: +15
Señal de compra detectada: +20

La IA explicaría el score en lenguaje simple:
“Esta empresa tiene alta prioridad porque pertenece al sector minero, aparece en procesos públicos recientes y se identificó al gerente de compras.”

Dashboard con 5 pantallas
Radar de empresas
Lista de empresas detectadas, sector, ubicación, tamaño y score.
Leads y decisores
Contactos clave por empresa, cargo, email, teléfono y nivel de relevancia.
Señales de compra
Noticias, licitaciones, proyectos, expansión, nuevas sucursales o compras públicas.
Scoring y priorización
Ranking de oportunidades: caliente, tibio, frío.
Reportes y seguimiento
Leads semanales, responsables comerciales, estado del contacto y próxima acción.
MVP recomendado

Primera versión simple:

Apollo.io para empresas y contactos.
SICOES como fuente de señales públicas.
Scraping o monitoreo básico de prensa industrial.
Base de datos en PostgreSQL.
Backend en Python/FastAPI.
Frontend en React o Next.js.
IA para resumir noticias, clasificar empresas y justificar el score.
Reporte semanal automático por email o PDF.
Nombre posible

Radar Comercial IA
“Detecta empresas con intención de compra antes que tu competencia.
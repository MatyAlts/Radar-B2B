import React from "react"

export const helpContent = {
  radar: {
    page: (
      <div className="space-y-2">
        <p className="font-semibold">Panel de Radar B2B</p>
        <p className="text-sm">
          Visualiza empresas con alta probabilidad de compra en tu sector. Usa los filtros
          para refinar tu búsqueda por industria, ubicación o scoring.
        </p>
      </div>
    ),
    scoring: (
      <div className="space-y-2">
        <p className="font-semibold">Scoring de Empresas</p>
        <p className="text-sm">
          El score (0-100) se basa en múltiples factores: sector estratégico, crecimiento
          reciente, participación en licitaciones, tamaño y decisores encontrados.
        </p>
      </div>
    ),
    detalle: (
      <div className="space-y-2">
        <p className="font-semibold">Detalle de Empresa</p>
        <p className="text-sm">
          Consulta información completa: contactos, señales de compra recientes, participación
          en procesos y justificación del scoring.
        </p>
      </div>
    ),
  },
  leads: {
    page: (
      <div className="space-y-2">
        <p className="font-semibold">Leads y Decisores</p>
        <p className="text-sm">
          Gestiona contactos clave enriquecidos desde Apollo.io. Filtra por cargo, empresa
          o estado de contacto.
        </p>
      </div>
    ),
    contactos: (
      <div className="space-y-2">
        <p className="font-semibold">Enriquecimiento de Contactos</p>
        <p className="text-sm">
          Los decisores se detectan automáticamente: Gerente General, Dueño, Jefe de Compras,
          Gerente de Operaciones.
        </p>
      </div>
    ),
  },
  signals: {
    page: (
      <div className="space-y-2">
        <p className="font-semibold">Señales de Compra</p>
        <p className="text-sm">
          Monitorea noticias de expansión, participación en licitaciones públicas (SICOES) y
          proyectos de inversión detectados.
        </p>
      </div>
    ),
  },
  scoring_detail: {
    page: (
      <div className="space-y-2">
        <p className="font-semibold">Scoring y Priorización</p>
        <p className="text-sm">
          Categoriza empresas en tres temperaturas: Caliente (70-100), Tibio (40-69), Frío
          (0-39). Prioriza tu seguimiento comercial.
        </p>
      </div>
    ),
  },
  reports: {
    page: (
      <div className="space-y-2">
        <p className="font-semibold">Reportes y Seguimiento</p>
        <p className="text-sm">
          Genera reportes semanales por email, asigna responsables comerciales y realiza
          seguimiento de acciones.
        </p>
      </div>
    ),
  },
}

'use client'

import { Tender } from '@/lib/api/types'
import { Badge } from '@/components/ui/badge'

interface TendersListProps {
  tenders: Tender[]
}

export function TendersList({ tenders }: TendersListProps) {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: { variant: 'secondary' as const, label: 'Pendiente', bgClass: 'bg-yellow-100 text-yellow-800' },
      awarded: { variant: 'default' as const, label: 'Adjudicado', bgClass: 'bg-green-100 text-green-800' },
      completed: { variant: 'secondary' as const, label: 'Completado', bgClass: 'bg-blue-100 text-blue-800' },
    }
    return variants[status] || variants.pending
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900">Licitaciones</h3>
      <div className="space-y-2">
        {tenders.map(tender => {
          const statusInfo = getStatusBadge(tender.status)
          return (
            <div key={tender.id} className="rounded-lg bg-gray-50 p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900">{tender.title}</p>
                  <p className="text-xs text-gray-500">{tender.description}</p>
                </div>
                <Badge variant={statusInfo.variant} className={statusInfo.bgClass}>
                  {statusInfo.label}
                </Badge>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                {new Date(tender.date).toLocaleDateString('es-ES')}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

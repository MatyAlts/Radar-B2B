'use client'

import { Tender } from '@/lib/api/types'
import { Badge } from '@/components/ui/badge'
import { FileText, Calendar, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TendersListProps {
  tenders: Tender[]
}

export function TendersList({ tenders }: TendersListProps) {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: { variant: 'warning' as const, label: 'Pendiente' },
      awarded: { variant: 'success' as const, label: 'Adjudicado' },
      completed: { variant: 'secondary' as const, label: 'Completado' },
    }
    return variants[status] || variants.pending
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Historial de Licitaciones</h3>
      </div>

      <div className="grid gap-3">
        {tenders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-6 text-center bg-secondary/10">
            <p className="text-sm text-muted-foreground">No se detectaron licitaciones previas</p>
          </div>
        ) : (
          tenders.map(tender => {
            const statusInfo = getStatusBadge(tender.status)
            return (
              <div 
                key={tender.id} 
                className="group relative overflow-hidden rounded-2xl border bg-card p-4 transition-all hover:border-primary/20 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <p className="font-bold text-foreground group-hover:text-primary transition-colors">{tender.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{tender.description}</p>
                  </div>
                  <Badge variant={statusInfo.variant} className="shrink-0 font-black uppercase tracking-tighter text-[10px]">
                    {statusInfo.label}
                  </Badge>
                </div>
                
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(tender.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <button className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <Info className="h-3 w-3" />
                    Detalles
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

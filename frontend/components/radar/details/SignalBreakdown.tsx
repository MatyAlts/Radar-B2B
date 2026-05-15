'use client'

import { CompanySignals } from '@/lib/api/types'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

interface SignalBreakdownProps {
  signals: CompanySignals
}

export function SignalBreakdown({ signals }: SignalBreakdownProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">Desglose de Señales</h3>
        <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
          {signals.total_points} puntos totales
        </div>
      </div>
      
      <div className="grid gap-3">
        {signals.signals.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-6 text-center">
            <p className="text-sm text-muted-foreground">Sin señales detectadas</p>
          </div>
        ) : (
          signals.signals.map(signal => (
            <div 
              key={signal.id} 
              className={cn(
                "group relative flex items-start gap-4 rounded-xl border p-4 transition-all hover:shadow-md",
                signal.active 
                  ? "border-success/20 bg-success/5" 
                  : "border-border bg-secondary/30 opacity-60"
              )}
            >
              <div className={cn(
                "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                signal.active ? "border-success bg-success text-white" : "border-muted bg-muted/20"
              )}>
                {signal.active && (
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              
              <div className="flex-1 space-y-1">
                <p className="text-sm font-bold leading-none text-foreground">{signal.name}</p>
                <p className="text-xs text-muted-foreground">{signal.description}</p>
              </div>

              <div className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-black tracking-wider",
                signal.active
                  ? "bg-success text-success-foreground shadow-sm"
                  : "bg-muted text-muted-foreground"
              )}>
                +{signal.points}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

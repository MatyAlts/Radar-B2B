'use client'

import { CompanySignals } from '@/lib/api/types'
import { Checkbox } from '@/components/ui/checkbox'

interface SignalBreakdownProps {
  signals: CompanySignals
}

export function SignalBreakdown({ signals }: SignalBreakdownProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900">Desglose de Señales</h3>
      <div className="space-y-2">
        {signals.signals.length === 0 ? (
          <p className="text-sm text-gray-500">Sin señales</p>
        ) : (
          signals.signals.map(signal => (
            <div key={signal.id} className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
              <Checkbox checked={signal.active} disabled className="mt-1" />
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-900">{signal.name}</p>
                <p className="text-xs text-gray-500">{signal.description}</p>
              </div>
              <span className={`ml-2 whitespace-nowrap rounded px-2 py-1 text-xs font-semibold ${
                signal.active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                +{signal.points}
              </span>
            </div>
          ))
        )}
      </div>
      <div className="border-t border-gray-200 pt-2">
        <p className="text-sm font-semibold text-gray-900">
          Total: <span className="text-lg text-blue-600">{signals.total_points}</span> puntos
        </p>
      </div>
    </div>
  )
}

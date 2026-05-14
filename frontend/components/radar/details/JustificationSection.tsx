'use client'

import { Skeleton } from '@/components/ui/skeleton'

interface JustificationSectionProps {
  justification: string | null
}

export function JustificationSection({ justification }: JustificationSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900">Justificación del Scoring</h3>
      {justification === null ? (
        <div className="space-y-2 rounded-lg bg-blue-50 p-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <p className="text-sm text-blue-800">Generando justificación...</p>
          </div>
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700">{justification}</p>
      )}
    </div>
  )
}

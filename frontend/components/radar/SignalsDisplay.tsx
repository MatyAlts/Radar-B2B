'use client'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { TrendingUp, FileText, Zap } from 'lucide-react'
import { Signal } from '@/lib/api/types'

interface SignalsDisplayProps {
  signals: Signal[]
}

const signalIcons: Record<string, typeof TrendingUp> = {
  expansion: TrendingUp,
  tender: FileText,
  news: Zap,
}

export function SignalsDisplay({ signals }: SignalsDisplayProps) {
  const activeSignals = signals.filter(s => s.active)

  if (activeSignals.length === 0) {
    return <span className="text-xs text-gray-400">Sin señales</span>
  }

  return (
    <div className="flex items-center gap-2">
      {activeSignals.map(signal => {
        const Icon = signalIcons[signal.type] || TrendingUp
        return (
          <Tooltip key={signal.id}>
            <TooltipTrigger asChild>
              <div className="cursor-help rounded-full p-1 hover:bg-gray-100">
                <Icon className="h-4 w-4 text-slate-600" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-semibold">{signal.name}</p>
              <p className="text-xs">{signal.description}</p>
              <p className="text-xs text-yellow-300">+{signal.points} puntos</p>
            </TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}

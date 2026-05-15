'use client'

import { Flame, Thermometer, Snowflake } from 'lucide-react'
import { useRadarFilters } from '@/lib/hooks/use-radar-filters'
import { Temperature } from '@/lib/api/types'
import { cn } from '@/lib/utils'

const OPTIONS: Array<{
  value: Temperature
  label: string
  Icon: typeof Flame
  activeClass: string
}> = [
  {
    value: 'caliente',
    label: 'Caliente',
    Icon: Flame,
    activeClass: 'bg-destructive/12 border-destructive/30 text-destructive font-semibold',
  },
  {
    value: 'tibio',
    label: 'Tibio',
    Icon: Thermometer,
    activeClass: 'bg-warning/15 border-warning/30 text-warning-foreground font-semibold',
  },
  {
    value: 'frío',
    label: 'Frío',
    Icon: Snowflake,
    activeClass: 'bg-secondary border-border text-secondary-foreground font-semibold',
  },
]

export function TemperatureFilter() {
  const filters = useRadarFilters()

  const toggle = (value: Temperature) =>
    filters.setTemperature(filters.temperature === value ? undefined : value)

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        Temperatura
      </p>
      <div className="flex flex-col gap-1.5">
        {OPTIONS.map(({ value, label, Icon, activeClass }) => (
          <button
            key={value}
            type="button"
            onClick={() => toggle(value)}
            className={cn(
              'flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all',
              filters.temperature === value
                ? activeClass
                : 'border-transparent bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground'
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

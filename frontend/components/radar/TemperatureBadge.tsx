import { Flame, Thermometer, Snowflake } from 'lucide-react'
import { Temperature } from '@/lib/api/types'
import { cn } from '@/lib/utils'

interface TemperatureBadgeProps {
  temperature: Temperature
  className?: string
}

const VARIANTS: Record<
  Temperature,
  { label: string; Icon: typeof Flame; className: string }
> = {
  caliente: {
    label: 'Caliente',
    Icon: Flame,
    className: 'bg-destructive/12 text-destructive border-destructive/20',
  },
  tibio: {
    label: 'Tibio',
    Icon: Thermometer,
    className: 'bg-warning/15 text-warning-foreground border-warning/25',
  },
  frío: {
    label: 'Frío',
    Icon: Snowflake,
    className: 'bg-secondary text-muted-foreground border-border',
  },
}

export function TemperatureBadge({ temperature, className }: TemperatureBadgeProps) {
  const { label, Icon, className: variantClass } = VARIANTS[temperature]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold',
        variantClass,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  )
}

import { Badge } from '@/components/ui/badge'
import { Flame, Thermometer, Snowflake } from 'lucide-react'
import { Temperature } from '@/lib/api/types'
import { cn } from '@/lib/utils'

interface TemperatureBadgeProps {
  temperature: Temperature
  className?: string
}

export function TemperatureBadge({ temperature, className }: TemperatureBadgeProps) {
  const variants = {
    caliente: {
      label: 'Caliente',
      icon: Flame,
      variant: 'destructive' as const,
    },
    tibio: {
      label: 'Tibio',
      icon: Thermometer,
      variant: 'warning' as const,
    },
    frío: {
      label: 'Frío',
      icon: Snowflake,
      variant: 'outline' as const,
    },
  }

  const { label, icon: Icon, variant } = variants[temperature]

  return (
    <Badge variant={variant} className={cn('gap-1 px-3 py-1', className)}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  )
}

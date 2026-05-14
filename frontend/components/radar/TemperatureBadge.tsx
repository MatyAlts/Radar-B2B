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
      variant: 'default' as const,
      bgClass: 'bg-red-100 text-red-800',
    },
    tibio: {
      label: 'Tibio',
      icon: Thermometer,
      variant: 'secondary' as const,
      bgClass: 'bg-yellow-100 text-yellow-800',
    },
    frío: {
      label: 'Frío',
      icon: Snowflake,
      variant: 'secondary' as const,
      bgClass: 'bg-blue-100 text-blue-800',
    },
  }

  const { label, icon: Icon, variant, bgClass } = variants[temperature]

  return (
    <Badge variant={variant} className={cn('gap-1 px-3 py-1', bgClass, className)}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  )
}

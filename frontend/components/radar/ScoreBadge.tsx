import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ScoreBadgeProps {
  score: number
  className?: string
}

export function ScoreBadge({ score, className }: ScoreBadgeProps) {
  const getVariantByScore = (score: number) => {
    if (score >= 70) return 'destructive' as const
    if (score >= 40) return 'warning' as const
    return 'outline' as const
  }

  const variant = getVariantByScore(score)

  return (
    <Badge variant={variant} className={cn('px-3 py-1 font-semibold', className)}>
      {score}
    </Badge>
  )
}

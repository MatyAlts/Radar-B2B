import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ScoreBadgeProps {
  score: number
  className?: string
}

export function ScoreBadge({ score, className }: ScoreBadgeProps) {
  const getVariantByScore = (score: number) => {
    if (score >= 70) return { variant: 'default' as const, bgClass: 'bg-red-100 text-red-800' }
    if (score >= 40) return { variant: 'secondary' as const, bgClass: 'bg-yellow-100 text-yellow-800' }
    return { variant: 'secondary' as const, bgClass: 'bg-gray-100 text-gray-800' }
  }

  const { variant, bgClass } = getVariantByScore(score)

  return (
    <Badge variant={variant} className={cn('px-3 py-1 font-semibold', bgClass, className)}>
      {score}
    </Badge>
  )
}

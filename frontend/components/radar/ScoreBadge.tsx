import { cn } from '@/lib/utils'

interface ScoreBadgeProps {
  score: number
  className?: string
}

export function ScoreBadge({ score, className }: ScoreBadgeProps) {
  const tier =
    score >= 70 ? 'high' : score >= 40 ? 'mid' : 'low'

  const ringClass = {
    high: 'border-success text-success bg-success/10',
    mid: 'border-warning text-warning bg-warning/10',
    low: 'border-border text-muted-foreground bg-secondary/60',
  }[tier]

  return (
    <div
      className={cn(
        'relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 font-black text-xs tabular-nums transition-transform hover:scale-110',
        ringClass,
        className
      )}
    >
      {score}
    </div>
  )
}

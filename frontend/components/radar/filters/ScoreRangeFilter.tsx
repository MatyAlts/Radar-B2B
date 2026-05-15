'use client'

import { useRadarFilters } from '@/lib/hooks/use-radar-filters'
import { Slider } from '@/components/ui/slider'

export function ScoreRangeFilter() {
  const filters = useRadarFilters()

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Score
        </p>
        <span className="text-[11px] font-semibold tabular-nums text-foreground">
          {filters.scoreRange[0]} – {filters.scoreRange[1]}
        </span>
      </div>
      <div className="px-0.5">
        <Slider
          min={0}
          max={100}
          step={5}
          value={filters.scoreRange}
          onValueChange={v => filters.setScoreRange([v[0], v[1]])}
        />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  )
}

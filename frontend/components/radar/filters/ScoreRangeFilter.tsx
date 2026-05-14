'use client'

import { useRadarFilters } from '@/lib/hooks/use-radar-filters'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

export function ScoreRangeFilter() {
  const filters = useRadarFilters()

  return (
    <div className="space-y-4">
      <Label className="font-semibold text-gray-900">Rango de Score</Label>
      <div className="space-y-2">
        <Slider
          min={0}
          max={100}
          step={1}
          value={filters.scoreRange}
          onValueChange={(value) => filters.setScoreRange([value[0], value[1]])}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>{filters.scoreRange[0]}</span>
          <span>{filters.scoreRange[1]}</span>
        </div>
      </div>
    </div>
  )
}

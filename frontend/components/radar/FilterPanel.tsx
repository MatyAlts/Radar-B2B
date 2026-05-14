'use client'

import { useRadarFilters } from '@/lib/hooks/use-radar-filters'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { TemperatureFilter } from './filters/TemperatureFilter'
import { IndustryFilter } from './filters/IndustryFilter'
import { ScoreRangeFilter } from './filters/ScoreRangeFilter'
import { useDebounce } from '@/lib/hooks/use-debounce'
import { useEffect, useState } from 'react'

export function FilterPanel() {
  const filters = useRadarFilters()
  const [queryInput, setQueryInput] = useState(filters.query)
  const debouncedQuery = useDebounce(queryInput, 300)

  useEffect(() => {
    filters.setQuery(debouncedQuery)
  }, [debouncedQuery])

  const activeFilterCount =
    filters.industries.length +
    (filters.temperature ? 1 : 0) +
    (filters.query ? 1 : 0) +
    (filters.scoreRange[0] !== 0 || filters.scoreRange[1] !== 100 ? 1 : 0)

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Filtros</h2>
        {filters.hasActiveFilters() && (
          <Badge variant="secondary">{activeFilterCount} activos</Badge>
        )}
      </div>

      <Input
        placeholder="Buscar por nombre, sector o ciudad..."
        value={queryInput}
        onChange={e => setQueryInput(e.target.value)}
        className="w-full"
      />

      <TemperatureFilter />
      <IndustryFilter />
      <ScoreRangeFilter />

      {filters.hasActiveFilters() && (
        <Button
          onClick={() => filters.resetFilters()}
          variant="outline"
          className="w-full"
        >
          <X className="mr-2 h-4 w-4" />
          Limpiar filtros
        </Button>
      )}
    </div>
  )
}

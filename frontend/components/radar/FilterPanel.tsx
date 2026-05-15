'use client'

import { useRadarFilters } from '@/lib/hooks/use-radar-filters'
import { Input } from '@/components/ui/input'
import { X, Search } from 'lucide-react'
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery])

  const hasActive = filters.hasActiveFilters()

  const handleClear = () => {
    filters.resetFilters()
    setQueryInput('')
  }

  return (
    <aside className="flex h-full w-52 shrink-0 flex-col gap-5 overflow-y-auto rounded-xl border border-border bg-card px-4 py-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          Filtros
        </span>
        {hasActive && (
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1 text-[10px] font-semibold text-destructive transition-colors hover:text-destructive/80"
          >
            <X className="h-3 w-3" />
            Limpiar
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar empresa..."
          value={queryInput}
          onChange={e => setQueryInput(e.target.value)}
          className="h-8 w-full rounded-lg border-transparent bg-secondary/50 pl-8 pr-3 text-xs focus:border-ring/20 focus:bg-background"
        />
      </div>

      {/* Score */}
      <ScoreRangeFilter />

      {/* Temperatura */}
      <TemperatureFilter />

      {/* Sector */}
      <IndustryFilter />
    </aside>
  )
}

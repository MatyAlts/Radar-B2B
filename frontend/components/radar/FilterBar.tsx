'use client'

import { useRadarFilters } from '@/lib/hooks/use-radar-filters'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Slider } from '@/components/ui/slider'
import {
  X,
  Search,
  Briefcase,
  SlidersHorizontal,
  Flame,
  Thermometer,
  Snowflake,
} from 'lucide-react'
import { useDebounce } from '@/lib/hooks/use-debounce'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Industry, Temperature } from '@/lib/api/types'

const INDUSTRIES: Array<{ value: Industry; label: string }> = [
  { value: 'mineria', label: 'Minería' },
  { value: 'mining & metals', label: 'Mining & Metals' },
  { value: 'logistica', label: 'Logística' },
  { value: 'logistics & supply chain', label: 'Logistics' },
  { value: 'almacenamiento', label: 'Almacenamiento' },
  { value: 'warehousing', label: 'Warehousing' },
  { value: 'chemicals', label: 'Chemicals' },
  { value: 'farming', label: 'Farming' },
  { value: 'mechanical or industrial engineering', label: 'Engineering' },
]

const TEMPERATURES: Array<{
  value: Temperature
  label: string
  Icon: typeof Flame
  activeClass: string
}> = [
  {
    value: 'caliente',
    label: 'Caliente',
    Icon: Flame,
    activeClass: 'bg-destructive text-destructive-foreground border-destructive',
  },
  {
    value: 'tibio',
    label: 'Tibio',
    Icon: Thermometer,
    activeClass: 'bg-warning text-warning-foreground border-warning',
  },
  {
    value: 'frío',
    label: 'Frío',
    Icon: Snowflake,
    activeClass: 'bg-secondary text-secondary-foreground border-border',
  },
]

export function FilterBar() {
  const filters = useRadarFilters()
  const [queryInput, setQueryInput] = useState(filters.query)
  const debouncedQuery = useDebounce(queryInput, 300)

  useEffect(() => {
    filters.setQuery(debouncedQuery)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery])

  const handleIndustryChange = (value: string) => {
    filters.setIndustries(value === 'all' ? [] : [value as Industry])
  }

  const toggleTemperature = (temp: Temperature) => {
    filters.setTemperature(filters.temperature === temp ? undefined : temp)
  }

  const scoreIsActive =
    filters.scoreRange[0] !== 0 || filters.scoreRange[1] !== 100
  const hasActiveFilters =
    filters.industries.length > 0 ||
    !!filters.temperature ||
    !!filters.query ||
    scoreIsActive

  const industryLabel =
    INDUSTRIES.find(i => i.value === filters.industries[0])?.label ?? 'Sector'

  return (
    <div className="flex items-center gap-2 overflow-x-auto rounded-xl border border-border bg-card px-3 py-2 shadow-sm">
      {/* Search — fixed width, doesn't grow */}
      <div className="relative w-48 shrink-0">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar empresa..."
          value={queryInput}
          onChange={e => setQueryInput(e.target.value)}
          className="h-8 w-full rounded-lg border-transparent bg-secondary/50 pl-8 pr-3 text-sm focus:border-ring/20 focus:bg-background"
        />
      </div>

      <div className="h-5 w-px shrink-0 bg-border/60" />

      {/* Temperature pills */}
      <div className="flex shrink-0 items-center gap-1">
        {TEMPERATURES.map(({ value, label, Icon, activeClass }) => (
          <button
            key={value}
            type="button"
            onClick={() => toggleTemperature(value)}
            className={cn(
              'flex h-8 shrink-0 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition-all',
              filters.temperature === value
                ? activeClass
                : 'border-transparent bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
            )}
          >
            <Icon className="h-3 w-3" />
            {label}
          </button>
        ))}
      </div>

      <div className="h-5 w-px shrink-0 bg-border/60" />

      {/* Industry — compact select with active state */}
      <Select
        value={filters.industries[0] || 'all'}
        onValueChange={handleIndustryChange}
      >
        <SelectTrigger
          className={cn(
            'h-8 w-36 shrink-0 rounded-lg border-transparent text-xs font-semibold transition-all [&>span]:line-clamp-1',
            filters.industries.length > 0
              ? 'bg-primary text-primary-foreground [&_svg]:text-primary-foreground'
              : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
          )}
        >
          <div className="flex min-w-0 items-center gap-1.5">
            <Briefcase className="h-3 w-3 shrink-0" />
            <span className="truncate">
              {filters.industries.length > 0 ? industryLabel : 'Sector'}
            </span>
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {INDUSTRIES.map(ind => (
            <SelectItem key={ind.value} value={ind.value}>
              {ind.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Score — fixed-width popover button, never resizes */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              'flex h-8 w-36 shrink-0 items-center gap-1.5 rounded-lg border border-transparent px-2.5 text-xs font-semibold transition-all',
              scoreIsActive
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
            )}
          >
            <SlidersHorizontal className="h-3 w-3 shrink-0" />
            <span className="flex-1 text-left">Score</span>
            <span className="tabular-nums opacity-80">
              {filters.scoreRange[0]}–{filters.scoreRange[1]}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-64 p-4"
          align="start"
          sideOffset={8}
          collisionPadding={16}
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Rango de Score
            </span>
            <Badge
              variant="secondary"
              className="h-5 px-1.5 text-[10px] tabular-nums"
            >
              {filters.scoreRange[0]} – {filters.scoreRange[1]}
            </Badge>
          </div>
          <div className="px-1">
            <Slider
              min={0}
              max={100}
              step={5}
              value={filters.scoreRange}
              onValueChange={filters.setScoreRange}
            />
          </div>
          <div className="mt-3 flex justify-between text-[10px] font-medium text-muted-foreground">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
        </PopoverContent>
      </Popover>

      {/* Spacer — pushes clear button to the right */}
      <div className="flex-1" />

      {/* Clear — only visible when filters are active */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => {
            filters.resetFilters()
            setQueryInput('')
          }}
          className="flex h-8 shrink-0 items-center gap-1 rounded-lg px-2.5 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/8"
        >
          <X className="h-3.5 w-3.5" />
          Limpiar
        </button>
      )}
    </div>
  )
}

'use client'

import { useRadarFilters } from '@/lib/hooks/use-radar-filters'
import { Industry } from '@/lib/api/types'
import { cn } from '@/lib/utils'

const INDUSTRIES: Array<{ value: Industry; label: string }> = [
  { value: 'industria', label: 'Industria' },
  { value: 'agro', label: 'Agro' },
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

export function IndustryFilter() {
  const filters = useRadarFilters()

  const toggle = (industry: Industry) => {
    const next = filters.industries.includes(industry)
      ? filters.industries.filter(i => i !== industry)
      : [...filters.industries, industry]
    filters.setIndustries(next)
  }

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        Sector
      </p>
      <div className="flex flex-col gap-1">
        {INDUSTRIES.map(({ value, label }) => {
          const active = filters.industries.includes(value)
          return (
            <button
              key={value}
              type="button"
              onClick={() => toggle(value)}
              className={cn(
                'flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition-all',
                active
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <span
                className={cn(
                  'flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm border transition-colors',
                  active
                    ? 'border-primary-foreground/50 bg-primary-foreground/20'
                    : 'border-border'
                )}
              >
                {active && (
                  <svg
                    className="h-2.5 w-2.5"
                    fill="none"
                    viewBox="0 0 10 10"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2 5l2.5 2.5L8 3"
                    />
                  </svg>
                )}
              </span>
              <span className="truncate">{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

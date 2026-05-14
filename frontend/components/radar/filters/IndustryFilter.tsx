'use client'

import { useRadarFilters } from '@/lib/hooks/use-radar-filters'
import { Label } from '@/components/ui/label'
import { Industry } from '@/lib/api/types'

const INDUSTRIES: Array<{ value: Industry; label: string }> = [
  { value: 'industria', label: 'Industria' },
  { value: 'logistica', label: 'Logística' },
  { value: 'agro', label: 'Agro' },
  { value: 'mineria', label: 'Minería' },
  { value: 'almacenamiento', label: 'Almacenamiento' },
]

export function IndustryFilter() {
  const filters = useRadarFilters()

  const toggleIndustry = (industry: Industry) => {
    const updated = filters.industries.includes(industry)
      ? filters.industries.filter(i => i !== industry)
      : [...filters.industries, industry]
    filters.setIndustries(updated)
  }

  return (
    <div className="space-y-2">
      <Label className="font-semibold text-gray-900">Sector</Label>
      <div className="space-y-2">
        {INDUSTRIES.map(industry => (
          <div key={industry.value} className="flex items-center">
            <input
              type="checkbox"
              id={`industry-${industry.value}`}
              checked={filters.industries.includes(industry.value)}
              onChange={() => toggleIndustry(industry.value)}
              className="h-4 w-4 cursor-pointer"
            />
            <label htmlFor={`industry-${industry.value}`} className="ml-2 cursor-pointer text-sm">
              {industry.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

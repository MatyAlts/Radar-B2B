'use client'

import { useRadarFilters } from '@/lib/hooks/use-radar-filters'
import { Label } from '@/components/ui/label'
import { Temperature } from '@/lib/api/types'

export function TemperatureFilter() {
  const filters = useRadarFilters()

  const options: Array<{ value: Temperature | undefined; label: string }> = [
    { value: undefined, label: 'Todos' },
    { value: 'caliente', label: 'Caliente' },
    { value: 'tibio', label: 'Tibio' },
    { value: 'frío', label: 'Frío' },
  ]

  return (
    <div className="space-y-2">
      <Label className="font-semibold text-gray-900">Temperatura</Label>
      <div className="space-y-2">
        {options.map(option => (
          <div key={option.label} className="flex items-center">
            <input
              type="radio"
              id={`temp-${option.label}`}
              name="temperature"
              value={option.label}
              checked={filters.temperature === option.value}
              onChange={() => filters.setTemperature(option.value)}
              className="h-4 w-4 cursor-pointer"
            />
            <label htmlFor={`temp-${option.label}`} className="ml-2 cursor-pointer text-sm">
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

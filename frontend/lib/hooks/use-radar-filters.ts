'use client'

import { useRadarFiltersStore } from '@/lib/store/radar-filters'

export function useRadarFilters() {
  return useRadarFiltersStore()
}

'use client'

import { useQuery } from '@tanstack/react-query'
import { listCompanies } from '@/lib/api/companies'
import { useRadarFilters } from './use-radar-filters'

export function useCompanies() {
  const filters = useRadarFilters()

  const query = useQuery({
    queryKey: [
      'companies',
      filters.industries,
      filters.temperature,
      filters.query,
      filters.scoreRange,
      filters.page,
      filters.orderBy,
      filters.order,
    ],
    queryFn: () =>
      listCompanies({
        industries: filters.industries.length > 0 ? filters.industries : undefined,
        temperature: filters.temperature,
        query: filters.query || undefined,
        score_min: filters.scoreRange[0],
        score_max: filters.scoreRange[1],
        page: filters.page,
        page_size: 20,
        order_by: filters.orderBy,
        order: filters.order,
      }),
    keepPreviousData: true,
  })

  return query
}

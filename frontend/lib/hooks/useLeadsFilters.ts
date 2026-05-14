import { useLeadsFiltersStore } from '@/lib/store/leads-filters'

export function useLeadsFilters() {
  const { companyId, titleQuery, reliability, page, setFilter, resetFilters, setPage } = useLeadsFiltersStore()

  return {
    companyId,
    titleQuery,
    reliability,
    page,
    setFilter,
    resetFilters,
    setPage,
  }
}

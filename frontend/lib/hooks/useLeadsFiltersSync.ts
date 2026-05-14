import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQueryState, parseAsString, parseAsInteger } from 'nuqs'
import { useLeadsFiltersStore } from '@/lib/store/leads-filters'

export function useLeadsFiltersSync() {
  const [company, setCompany] = useQueryState('company', parseAsString)
  const [title, setTitle] = useQueryState('title', parseAsString)
  const [reliability, setReliability] = useQueryState('reliability', parseAsString)
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const store = useLeadsFiltersStore()

  // Sync from URL to store on mount
  useEffect(() => {
    if (company) store.setFilter('companyId', company)
    if (title) store.setFilter('titleQuery', title)
    if (reliability) store.setFilter('reliability', reliability)
    if (page && page !== 1) store.setPage(page)
  }, [company, title, reliability, page, store])

  // Sync from store to URL
  const syncToUrl = {
    setCompanyId: (id?: string) => {
      store.setFilter('companyId', id)
      setCompany(id || null)
    },
    setTitleQuery: (q: string) => {
      store.setFilter('titleQuery', q)
      setTitle(q || null)
    },
    setReliability: (r?: string) => {
      store.setFilter('reliability', r)
      setReliability(r || null)
    },
    setPage: (p: number) => {
      store.setPage(p)
      setPage(p !== 1 ? p : null)
    },
    resetFilters: () => {
      store.resetFilters()
      setCompany(null)
      setTitle(null)
      setReliability(null)
      setPage(null)
    },
  }

  return {
    ...store,
    ...syncToUrl,
  }
}

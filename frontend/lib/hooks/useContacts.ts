import { useQuery } from '@tanstack/react-query'
import { listContacts } from '@/lib/api/contacts'
import { Contact } from '@/lib/api/types'
import { useLeadsFiltersStore } from '@/lib/store/leads-filters'

export function useContacts(companyIdProp?: string) {
  const { companyId: companyIdFromStore, titleQuery, reliability } = useLeadsFiltersStore()
  const companyId = companyIdProp || companyIdFromStore

  const { data: allContacts = [], ...query } = useQuery({
    queryKey: ['contacts', companyId],
    queryFn: () => (companyId ? listContacts(companyId) : Promise.resolve([])),
    enabled: !!companyId,
    keepPreviousData: true,
  })

  // Filter in-memory by title and reliability
  const filteredContacts = allContacts.filter((contact) => {
    if (titleQuery) {
      const q = titleQuery.toLowerCase()
      if (!contact.title.toLowerCase().includes(q)) return false
    }
    if (reliability && contact.reliability !== reliability) return false
    return true
  })

  return {
    contacts: filteredContacts,
    allContacts,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

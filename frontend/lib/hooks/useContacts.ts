import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { listContacts } from '@/lib/api/contacts'
import { Contact, ApiError } from '@/lib/api/types'
import { useLeadsFiltersStore } from '@/lib/store/leads-filters'

export function useContacts(companyIdProp?: string) {
  const { companyId: companyIdFromStore, titleQuery, reliability } = useLeadsFiltersStore()
  const companyId = companyIdProp || companyIdFromStore

  const { data: allContacts = [], ...query } = useQuery<Contact[]>({
    queryKey: ['contacts', companyId],
    queryFn: () => (companyId ? listContacts(companyId) : Promise.resolve([])),
    enabled: !!companyId,
    placeholderData: keepPreviousData,
  })

  // Detectar si es error 403
  const is403Error = query.error instanceof Error && query.error.message.includes('403')
  const errorMessage = is403Error
    ? 'Tu plan de Apollo no permite la búsqueda de contactos por API. Por favor, verifica tu suscripción.'
    : null

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
    is403Error,
    errorMessage,
    refetch: query.refetch,
  }
}

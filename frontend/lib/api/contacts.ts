import { apiFetch } from './client'
import { Contact, PaginatedResponse } from './types'
import { getMockCompanies } from './mock'

export async function listContacts(
  companyId: string
): Promise<Contact[]> {
  // Use mock data if enabled
  if (process.env.NEXT_PUBLIC_API_MOCK === 'true') {
    await new Promise(resolve => setTimeout(resolve, 300)) // Simulate network delay
    const mockData = getMockCompanies()
    const company = mockData.data.find(c => c.id === companyId)
    return company?.contacts || []
  }

  return apiFetch<Contact[]>(
    `/api/v1/companies/${companyId}/contacts`
  )
}

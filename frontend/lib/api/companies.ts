import { apiFetch } from './client'
import { Company, CompanyListParams, PaginatedResponse, ApiError } from './types'
import { getMockCompanies } from './mock'

export async function listCompanies(
  params: CompanyListParams = {}
): Promise<PaginatedResponse<Company>> {
  // Use mock data if enabled
  if (process.env.NEXT_PUBLIC_API_MOCK === 'true') {
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay
    const mockData = getMockCompanies()
    return filterMockCompanies(mockData, params)
  }

  const searchParams = new URLSearchParams()

  if (params.industries?.length) {
    searchParams.append('industries', params.industries.join(','))
  }

  if (params.temperature) {
    searchParams.append('temperature', params.temperature)
  }

  if (params.score_min !== undefined) {
    searchParams.append('score_min', String(params.score_min))
  }

  if (params.score_max !== undefined) {
    searchParams.append('score_max', String(params.score_max))
  }

  if (params.query) {
    searchParams.append('query', params.query)
  }

  if (params.page !== undefined) {
    searchParams.append('page', String(params.page))
  }

  if (params.page_size !== undefined) {
    searchParams.append('page_size', String(params.page_size))
  }

  if (params.order_by) {
    searchParams.append('order_by', params.order_by)
  }

  if (params.order) {
    searchParams.append('order', params.order)
  }

  const qs = searchParams.toString()
  const endpoint = qs ? `/api/v1/companies?${qs}` : '/api/v1/companies'

  return apiFetch<PaginatedResponse<Company>>(endpoint)
}

function filterMockCompanies(
  data: PaginatedResponse<Company>,
  params: CompanyListParams
): PaginatedResponse<Company> {
  let filtered = [...data.data]

  // Filter by industries
  if (params.industries?.length) {
    filtered = filtered.filter(c => params.industries!.includes(c.industry))
  }

  // Filter by temperature
  if (params.temperature) {
    filtered = filtered.filter(c => c.temperature === params.temperature)
  }

  // Filter by score range
  if (params.score_min !== undefined) {
    filtered = filtered.filter(c => c.score >= params.score_min!)
  }

  if (params.score_max !== undefined) {
    filtered = filtered.filter(c => c.score <= params.score_max!)
  }

  // Filter by query
  if (params.query) {
    const q = params.query.toLowerCase()
    filtered = filtered.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.industry.toLowerCase().includes(q)
    )
  }

  // Sort
  const orderBy = params.order_by || 'score'
  const order = params.order || 'desc'

  filtered.sort((a, b) => {
    let aVal = a[orderBy as keyof Company]
    let bVal = b[orderBy as keyof Company]

    if (typeof aVal === 'string') aVal = aVal.toLowerCase()
    if (typeof bVal === 'string') bVal = bVal.toLowerCase()

    if (aVal == null || bVal == null) return 0
    if (aVal < bVal) return order === 'asc' ? -1 : 1
    if (aVal > bVal) return order === 'asc' ? 1 : -1
    return 0
  })

  // Paginate
  const page = params.page || 1
  const pageSize = params.page_size || 20
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginatedData = filtered.slice(start, end)

  return {
    data: paginatedData,
    total: filtered.length,
    page,
    page_size: pageSize,
    total_pages: Math.ceil(filtered.length / pageSize),
  }
}

export async function enrichCompany(companyId: string): Promise<void> {
  // Mock enrichment if enabled
  if (process.env.NEXT_PUBLIC_API_MOCK === 'true') {
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate enrich delay
    return
  }

  await apiFetch<void>(`/api/v1/companies/${companyId}/enrich`, {
    method: 'POST',
  })
}

export async function syncCompanies(
  industries?: string[],
  locations?: string[]
): Promise<{ synced_count: number }> {
  if (process.env.NEXT_PUBLIC_API_MOCK === 'true') {
    await new Promise(resolve => setTimeout(resolve, 1500))
    return { synced_count: 0 }
  }

  const body: Record<string, string[]> = {}
  if (industries?.length) body.industries = industries
  if (locations?.length) body.locations = locations

  return apiFetch<{ synced_count: number }>('/api/v1/companies/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export async function recalculateCompanyScore(companyId: string): Promise<Company> {
  // Mock score calculation if enabled
  if (process.env.NEXT_PUBLIC_API_MOCK === 'true') {
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate scoring delay
    return { id: companyId } as Company
  }

  return apiFetch<Company>(`/api/v1/companies/${companyId}/score`, {
    method: 'POST',
  })
}

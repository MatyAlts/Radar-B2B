export type Temperature = 'caliente' | 'tibio' | 'frío'

export type Industry = 
  | 'industria' 
  | 'logistica' 
  | 'agro' 
  | 'mineria' 
  | 'almacenamiento'
  | 'mining & metals'
  | 'logistics & supply chain'
  | 'warehousing'
  | 'chemicals'
  | 'farming'
  | 'mechanical or industrial engineering'

export interface Signal {
  id: string
  type: string
  name: string
  description: string
  active: boolean
  points: number
}

export interface CompanySignals {
  signals: Signal[]
  total_points: number
}

export type ContactReliability = 'high' | 'medium' | 'low'

export interface Contact {
  id: string
  company_id: string
  name: string
  title: string
  email?: string
  linkedin_url?: string
  phone?: string
  reliability: ContactReliability
  last_updated_at: string
}

export interface Tender {
  id: string
  title: string
  description: string
  date: string
  status: 'pending' | 'awarded' | 'completed'
}

export interface Company {
  id: string
  name: string
  industry: Industry
  city: string
  country: string
  score: number
  temperature: Temperature
  signals: CompanySignals
  contacts: Contact[]
  tenders: Tender[]
  score_justification: string | null
  last_updated: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface CompanyListParams {
  industries?: Industry[]
  temperature?: Temperature
  score_min?: number
  score_max?: number
  query?: string
  page?: number
  page_size?: number
  order_by?: 'name' | 'score' | 'industry'
  order?: 'asc' | 'desc'
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

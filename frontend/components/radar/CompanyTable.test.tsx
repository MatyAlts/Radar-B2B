import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CompanyTable } from './CompanyTable'
import { Company } from '@/lib/api/types'

const createMockCompany = (overrides?: Partial<Company>): Company => ({
  id: '1',
  name: 'Test Company',
  industry: 'mineria',
  city: 'La Paz',
  country: 'Bolivia',
  score: 75,
  temperature: 'caliente',
  signals: {
    signals: [
      { id: '1', type: 'expansion', name: 'Expansion', description: 'Test', active: true, points: 20 },
    ],
    total_points: 20,
  },
  contacts: [],
  tenders: [],
  score_justification: 'Test justification',
  last_updated: '2024-05-14',
  ...overrides,
})

describe('CompanyTable', () => {
  it('should render skeleton loaders when loading', () => {
    const { container } = render(
      <CompanyTable companies={[]} isLoading={true} isError={false} />
    )
    const skeletons = container.querySelectorAll('[class*="animate-pulse"]')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('should show error message and retry button when error occurs', () => {
    render(
      <CompanyTable
        companies={[]}
        isLoading={false}
        isError={true}
        onRefetch={vi.fn()}
      />
    )
    expect(screen.getByText('Error al cargar las empresas')).toBeInTheDocument()
    expect(screen.getByText('Reintentar')).toBeInTheDocument()
  })

  it('should show empty state message when no companies', () => {
    render(
      <CompanyTable companies={[]} isLoading={false} isError={false} />
    )
    expect(screen.getByText('No hay empresas que coincidan con los filtros')).toBeInTheDocument()
  })

  it('should render companies in table rows', () => {
    const companies = [
      createMockCompany({ name: 'Company 1' }),
      createMockCompany({ name: 'Company 2', id: '2' }),
    ]

    render(
      <CompanyTable companies={companies} isLoading={false} isError={false} />
    )

    expect(screen.getByText('Company 1')).toBeInTheDocument()
    expect(screen.getByText('Company 2')).toBeInTheDocument()
  })

  it('should render table headers', () => {
    render(
      <CompanyTable
        companies={[createMockCompany()]}
        isLoading={false}
        isError={false}
      />
    )

    expect(screen.getByText('Empresa')).toBeInTheDocument()
    expect(screen.getByText('Sector')).toBeInTheDocument()
    expect(screen.getByText('Score')).toBeInTheDocument()
    expect(screen.getByText('Temperatura')).toBeInTheDocument()
  })

  it('should call onRowClick when a row is clicked', () => {
    const onRowClick = vi.fn()
    const company = createMockCompany()

    const { container } = render(
      <CompanyTable
        companies={[company]}
        isLoading={false}
        isError={false}
        onRowClick={onRowClick}
      />
    )

    const row = container.querySelector('tbody tr') as HTMLElement | null
    row?.click()

    expect(onRowClick).toHaveBeenCalledWith(company)
  })
})

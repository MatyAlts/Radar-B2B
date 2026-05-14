import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CompanyDetailDrawer } from './CompanyDetailDrawer'
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
  contacts: [
    { id: 'c1', name: 'John Doe', title: 'CEO', email: 'john@test.com' },
  ],
  tenders: [
    { id: 't1', title: 'Test Tender', description: 'Test description', date: '2024-05-14', status: 'pending' },
  ],
  score_justification: 'This is a test justification',
  last_updated: '2024-05-14',
  ...overrides,
})

describe('CompanyDetailDrawer', () => {
  it('should not render when company is null', () => {
    const { container } = render(
      <CompanyDetailDrawer company={null} isOpen={true} onClose={vi.fn()} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('should render drawer when company is provided and isOpen is true', () => {
    const company = createMockCompany()
    render(
      <CompanyDetailDrawer company={company} isOpen={true} onClose={vi.fn()} />
    )
    expect(screen.getByText('Test Company')).toBeInTheDocument()
  })

  it('should display company information', () => {
    const company = createMockCompany()
    render(
      <CompanyDetailDrawer company={company} isOpen={true} onClose={vi.fn()} />
    )
    expect(screen.getByText('Test Company')).toBeInTheDocument()
    expect(screen.getByText(/mineria/)).toBeInTheDocument()
    expect(screen.getByText(/La Paz, Bolivia/)).toBeInTheDocument()
  })

  it('should show score and temperature badges', () => {
    const company = createMockCompany({ score: 75, temperature: 'caliente' })
    render(
      <CompanyDetailDrawer company={company} isOpen={true} onClose={vi.fn()} />
    )
    expect(screen.getByText('75')).toBeInTheDocument()
    expect(screen.getByText('Caliente')).toBeInTheDocument()
  })

  it('should display justification when available', () => {
    const company = createMockCompany({ score_justification: 'Test justification' })
    render(
      <CompanyDetailDrawer company={company} isOpen={true} onClose={vi.fn()} />
    )
    expect(screen.getByText('Test justification')).toBeInTheDocument()
  })

  it('should show spinner when justification is null', () => {
    const company = createMockCompany({ score_justification: null })
    const { container } = render(
      <CompanyDetailDrawer company={company} isOpen={true} onClose={vi.fn()} />
    )
    expect(screen.getByText('Generando justificación...')).toBeInTheDocument()
  })

  it('should display contacts list', () => {
    const company = createMockCompany()
    render(
      <CompanyDetailDrawer company={company} isOpen={true} onClose={vi.fn()} />
    )
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('CEO')).toBeInTheDocument()
  })

  it('should display tenders list', () => {
    const company = createMockCompany()
    render(
      <CompanyDetailDrawer company={company} isOpen={true} onClose={vi.fn()} />
    )
    expect(screen.getByText('Test Tender')).toBeInTheDocument()
  })
})

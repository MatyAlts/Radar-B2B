import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { EnrichAction } from './EnrichAction'
import { Company } from '@/lib/api/types'

vi.mock('@tanstack/react-query', () => ({
  useMutation: vi.fn(),
  useQuery: vi.fn(),
}))

vi.mock('@/lib/api/companies', () => ({
  enrichCompany: vi.fn(),
}))

vi.mock('@/lib/api/contacts', () => ({
  listContacts: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
    info: vi.fn(),
  },
}))

import { useMutation, useQuery } from '@tanstack/react-query'
import { enrichCompany } from '@/lib/api/companies'
import { listContacts } from '@/lib/api/contacts'
import { toast } from 'sonner'

const mockCompany: Company = {
  id: '1',
  name: 'Minera San Cristóbal',
  industry: 'mineria',
  city: 'Potosí',
  country: 'Bolivia',
  score: 92,
  temperature: 'caliente',
  signals: { signals: [], total_points: 0 },
  contacts: [],
  tenders: [],
  score_justification: null,
  last_updated: new Date().toISOString(),
}

describe('EnrichAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not render if company has no name', () => {
    const company = { ...mockCompany, name: '' }
    vi.mocked(useQuery).mockReturnValue({
      data: [],
    } as any)

    const { container } = render(<EnrichAction company={company} />)
    expect(container.firstChild).toBeNull()
  })

  it('should render button when company has name', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: [],
    } as any)

    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as any)

    render(<EnrichAction company={mockCompany} />)
    expect(screen.getByRole('button', { name: /Buscar decisores/i })).toBeDefined()
  })

  it('should disable button during mutation', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: [],
    } as any)

    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
    } as any)

    render(<EnrichAction company={mockCompany} />)
    const button = screen.getByRole('button')
    expect(button.getAttribute('disabled')).not.toBeNull()
  })

  it('should show loading state during mutation', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: [],
    } as any)

    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
    } as any)

    render(<EnrichAction company={mockCompany} />)
    expect(screen.getByText(/Iniciando/i)).toBeDefined()
  })

  it('should call enrich mutation on button click', () => {
    const mockMutate = vi.fn()
    vi.mocked(useQuery).mockReturnValue({
      data: [],
    } as any)

    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any)

    render(<EnrichAction company={mockCompany} />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(mockMutate).toHaveBeenCalled()
  })

  it('should show success toast when new contacts found', () => {
    const mockMutate = vi.fn()
    vi.mocked(useQuery).mockReturnValue({
      data: [{ id: 'c1', company_id: '1', name: 'Test' }],
    } as any)

    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any)

    render(<EnrichAction company={mockCompany} />)
    expect(toast.success).not.toHaveBeenCalled()
  })

  it('should call onSuccess callback', () => {
    const onSuccess = vi.fn()
    vi.mocked(useQuery).mockReturnValue({
      data: [],
    } as any)

    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as any)

    render(<EnrichAction company={mockCompany} onSuccess={onSuccess} />)
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('should show tooltip with button text', async () => {
    vi.mocked(useQuery).mockReturnValue({
      data: [],
    } as any)

    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as any)

    render(<EnrichAction company={mockCompany} />)
    const button = screen.getByRole('button')

    fireEvent.mouseEnter(button)
    await waitFor(() => {
      expect(screen.getByText(/Buscar decisores en Apollo/i)).toBeDefined()
    }, { timeout: 1000 })
  })
})

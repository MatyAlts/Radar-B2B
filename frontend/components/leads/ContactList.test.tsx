import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { ContactList } from './ContactList'
import { Contact } from '@/lib/api/types'

vi.mock('@/lib/hooks/useContacts', () => ({
  useContacts: vi.fn(),
}))

vi.mock('./ContactCard', () => ({
  ContactCard: ({ contact }: { contact: Contact }) => (
    <div data-testid={`contact-${contact.id}`}>{contact.name}</div>
  ),
}))

import { useContacts } from '@/lib/hooks/useContacts'

const mockContact: Contact = {
  id: 'c1',
  company_id: '1',
  name: 'Jorge Mendez',
  title: 'Gerente General',
  email: 'jorge@example.com',
  reliability: 'high',
  last_updated_at: '2024-05-14',
}

describe('ContactList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render skeleton loaders when loading', () => {
    vi.mocked(useContacts).mockReturnValue({
      contacts: [],
      allContacts: [],
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    })

    render(<ContactList />)
    expect(screen.getByText(/Cargando contactos/i)).toBeDefined()
  })

  it('should render ContactCard for each contact', async () => {
    vi.mocked(useContacts).mockReturnValue({
      contacts: [mockContact],
      allContacts: [mockContact],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    })

    render(<ContactList />)
    await waitFor(() => {
      expect(screen.getByTestId('contact-c1')).toBeDefined()
      expect(screen.getByText('Jorge Mendez')).toBeDefined()
    })
  })

  it('should show empty state when no contacts', () => {
    vi.mocked(useContacts).mockReturnValue({
      contacts: [],
      allContacts: [],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    })

    render(<ContactList />)
    expect(screen.getByText(/No hay contactos disponibles/i)).toBeDefined()
  })

  it('should show contextual message when company has no contacts', () => {
    vi.mocked(useContacts).mockReturnValue({
      contacts: [],
      allContacts: [],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    })

    render(<ContactList companyId="1" />)
    expect(screen.getByText(/No hay contactos para esta empresa/i)).toBeDefined()
  })

  it('should show error state with retry button', () => {
    const mockRefetch = vi.fn()
    vi.mocked(useContacts).mockReturnValue({
      contacts: [],
      allContacts: [],
      isLoading: false,
      isError: true,
      error: { message: 'Network error' } as any,
      refetch: mockRefetch,
    })

    render(<ContactList />)
    expect(screen.getByText(/Error al cargar contactos/i)).toBeDefined()
    expect(screen.getByRole('button', { name: /Reintentar/i })).toBeDefined()
  })

  it('should display contact count', () => {
    const contacts = [mockContact, { ...mockContact, id: 'c2', name: 'Patricia Ruiz' }]
    vi.mocked(useContacts).mockReturnValue({
      contacts,
      allContacts: contacts,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    })

    render(<ContactList />)
    expect(screen.getByText(/2 contactos/i)).toBeDefined()
  })

  it('should pass companyId to useContacts hook', () => {
    vi.mocked(useContacts).mockReturnValue({
      contacts: [],
      allContacts: [],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    })

    render(<ContactList companyId="company-1" />)
    expect(useContacts).toHaveBeenCalledWith('company-1')
  })
})

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CompanyDetailDrawer } from './CompanyDetailDrawer'
import { Company } from '@/lib/api/types'

vi.mock('./ScoreBadge', () => ({
  ScoreBadge: () => <div>Score Badge</div>,
}))

vi.mock('./TemperatureBadge', () => ({
  TemperatureBadge: () => <div>Temperature Badge</div>,
}))

vi.mock('./details/SignalBreakdown', () => ({
  SignalBreakdown: () => <div>Signal Breakdown</div>,
}))

vi.mock('./details/JustificationSection', () => ({
  JustificationSection: () => <div>Justification</div>,
}))

vi.mock('./details/ContactsList', () => ({
  ContactsList: () => <div>Existing Contacts</div>,
}))

vi.mock('./details/TendersList', () => ({
  TendersList: () => <div>Tenders</div>,
}))

vi.mock('@/components/leads/ContactList', () => ({
  ContactList: ({ companyId }: { companyId: string }) => (
    <div data-testid="contact-list-new">Contactos nuevos - {companyId}</div>
  ),
}))

vi.mock('@/components/leads/EnrichAction', () => ({
  EnrichAction: ({ company }: { company: Company }) => (
    <div data-testid="enrich-action">Enrich {company.id}</div>
  ),
}))

const mockCompany: Company = {
  id: '1',
  name: 'Test Company',
  industry: 'mineria',
  city: 'La Paz',
  country: 'Bolivia',
  score: 85,
  temperature: 'caliente',
  signals: { signals: [], total_points: 0 },
  contacts: [],
  tenders: [],
  score_justification: 'Test justification',
  last_updated: new Date().toISOString(),
}

describe('CompanyDetailDrawer - Leads Tab', () => {
  it('should render both tabs', () => {
    render(
      <CompanyDetailDrawer company={mockCompany} isOpen={true} onClose={() => {}} />
    )

    expect(screen.getByRole('tab', { name: /Resumen/i })).toBeDefined()
    expect(screen.getByRole('tab', { name: /Contactos/i })).toBeDefined()
  })

  it('should show Resumen tab by default', () => {
    render(
      <CompanyDetailDrawer company={mockCompany} isOpen={true} onClose={() => {}} />
    )

    expect(screen.getByText('Score Badge')).toBeDefined()
    expect(screen.getByText('Signal Breakdown')).toBeDefined()
  })

  it('should switch to Contactos tab when clicked', async () => {
    render(
      <CompanyDetailDrawer company={mockCompany} isOpen={true} onClose={() => {}} />
    )

    const contactosTab = screen.getByRole('tab', { name: /Contactos/i })
    fireEvent.click(contactosTab)

    await waitFor(() => {
      expect(screen.getByTestId('contact-list-new')).toBeDefined()
    })
  })

  it('should render ContactList in Contactos tab', async () => {
    render(
      <CompanyDetailDrawer company={mockCompany} isOpen={true} onClose={() => {}} />
    )

    const contactosTab = screen.getByRole('tab', { name: /Contactos/i })
    fireEvent.click(contactosTab)

    await waitFor(() => {
      expect(screen.getByTestId('contact-list-new')).toHaveTextContent('1')
    })
  })

  it('should render EnrichAction in Contactos tab', async () => {
    render(
      <CompanyDetailDrawer company={mockCompany} isOpen={true} onClose={() => {}} />
    )

    const contactosTab = screen.getByRole('tab', { name: /Contactos/i })
    fireEvent.click(contactosTab)

    await waitFor(() => {
      expect(screen.getByTestId('enrich-action')).toBeDefined()
    })
  })

  it('should pass correct companyId to ContactList', async () => {
    render(
      <CompanyDetailDrawer company={mockCompany} isOpen={true} onClose={() => {}} />
    )

    const contactosTab = screen.getByRole('tab', { name: /Contactos/i })
    fireEvent.click(contactosTab)

    await waitFor(() => {
      expect(screen.getByText(/Contactos nuevos - 1/i)).toBeDefined()
    })
  })

  it('should not render when company is null', () => {
    const { container } = render(
      <CompanyDetailDrawer company={null} isOpen={true} onClose={() => {}} />
    )

    expect(container.firstChild).toBeNull()
  })

  it('should render drawer title with company name', () => {
    render(
      <CompanyDetailDrawer company={mockCompany} isOpen={true} onClose={() => {}} />
    )

    expect(screen.getByText('Test Company')).toBeDefined()
  })
})

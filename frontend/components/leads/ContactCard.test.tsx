import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ContactCard } from './ContactCard'
import { Contact } from '@/lib/api/types'
import { Toaster } from 'sonner'

const mockContact: Contact = {
  id: 'c1',
  company_id: '1',
  name: 'Jorge Mendez',
  title: 'Gerente General',
  email: 'jorge@example.com',
  linkedin_url: 'https://linkedin.com/in/jorge',
  phone: '+591-1234567',
  reliability: 'high',
  last_updated_at: '2024-05-14',
}

describe('ContactCard', () => {
  it('should render contact name and title', () => {
    render(<ContactCard contact={mockContact} />)
    expect(screen.getByText('Jorge Mendez')).toBeDefined()
    expect(screen.getByText('Gerente General')).toBeDefined()
  })

  it('should show C-Level badge for "Gerente General"', () => {
    render(<ContactCard contact={mockContact} />)
    const badges = screen.getAllByText(/C-Level|Gerente General/i)
    expect(badges.some(b => b.textContent?.includes('C-Level'))).toBe(true)
  })

  it('should show Manager badge for "Jefe de Compras"', () => {
    const contact: Contact = {
      ...mockContact,
      title: 'Jefe de Compras',
    }
    render(<ContactCard contact={contact} />)
    const badges = screen.getAllByText(/Manager|Jefe/i)
    expect(badges.some(b => b.textContent?.includes('Manager'))).toBe(true)
  })

  it('should show reliability badge', () => {
    render(<ContactCard contact={mockContact} />)
    expect(screen.getByText(/Confiabilidad.*high/i)).toBeDefined()
  })

  it('should render email when available', () => {
    render(<ContactCard contact={mockContact} />)
    expect(screen.getByText('jorge@example.com')).toBeDefined()
  })

  it('should render phone when available', () => {
    render(<ContactCard contact={mockContact} />)
    expect(screen.getByText('+591-1234567')).toBeDefined()
  })

  it('should render LinkedIn link when available', () => {
    render(<ContactCard contact={mockContact} />)
    const link = screen.getByRole('link', { name: /LinkedIn/i })
    expect(link.getAttribute('href')).toBe('https://linkedin.com/in/jorge')
  })

  it('should not render email when undefined', () => {
    const contact: Contact = {
      ...mockContact,
      email: undefined,
    }
    render(<ContactCard contact={contact} />)
    expect(screen.queryByText('jorge@example.com')).toBeNull()
  })

  it('should not render phone when undefined', () => {
    const contact: Contact = {
      ...mockContact,
      phone: undefined,
    }
    render(<ContactCard contact={contact} />)
    expect(screen.queryByText('+591-1234567')).toBeNull()
  })

  it('should not render LinkedIn when undefined', () => {
    const contact: Contact = {
      ...mockContact,
      linkedin_url: undefined,
    }
    render(<ContactCard contact={contact} />)
    expect(screen.queryByRole('link', { name: /LinkedIn/i })).toBeNull()
  })

  it('should show updated date', () => {
    render(<ContactCard contact={mockContact} />)
    expect(screen.getByText(/Actualizado:/i)).toBeDefined()
  })
})

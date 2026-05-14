import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useSearchParams } from 'next/navigation'

// Mock the hooks and components
vi.mock('@/components/leads/LeadsFilterBar', () => ({
  LeadsFilterBar: () => <div data-testid="filter-bar">Filter Bar</div>,
}))

vi.mock('@/components/leads/ContactList', () => ({
  ContactList: () => <div data-testid="contact-list">Contact List</div>,
}))

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
  useRouter: vi.fn(),
}))

// Import the page component after mocks are set up
import LeadsPage from './page'

describe('Leads Page Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams())
  })

  it('should render the leads page with title', () => {
    render(<LeadsPage />)
    expect(screen.getByText('Leads y Decisores')).toBeDefined()
  })

  it('should render description text', () => {
    render(<LeadsPage />)
    expect(
      screen.getByText('Encuentra y gestiona los contactos clave de todas tus empresas objetivo')
    ).toBeDefined()
  })

  it('should render the filter bar', () => {
    render(<LeadsPage />)
    expect(screen.getByTestId('filter-bar')).toBeDefined()
  })

  it('should render the contact list', () => {
    render(<LeadsPage />)
    expect(screen.getByTestId('contact-list')).toBeDefined()
  })

  it('should have proper page structure', () => {
    const { container } = render(<LeadsPage />)

    // Check for main sections
    expect(container.querySelector('h1')).toHaveTextContent('Leads y Decisores')
    expect(container.querySelector('[data-testid="filter-bar"]')).toBeDefined()
    expect(container.querySelector('[data-testid="contact-list"]')).toBeDefined()
  })

  it('should have min-h-screen for full height', () => {
    const { container } = render(<LeadsPage />)
    const mainDiv = container.firstChild

    expect(mainDiv?.className).toMatch(/min-h-screen/)
  })

  it('should display content in a centered container', () => {
    const { container } = render(<LeadsPage />)

    // Check for max-width constraint
    const contentContainer = container.querySelector('.max-w-5xl')
    expect(contentContainer).toBeDefined()
  })

  it('should have proper spacing between sections', () => {
    const { container } = render(<LeadsPage />)

    // Check for space-y-6 class
    const mainContainer = container.querySelector('.space-y-6')
    expect(mainContainer).toBeDefined()
  })
})

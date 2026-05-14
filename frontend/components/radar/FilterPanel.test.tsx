import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FilterPanel } from './FilterPanel'
import { useRadarFiltersStore } from '@/lib/store/radar-filters'

describe('FilterPanel', () => {
  beforeEach(() => {
    useRadarFiltersStore.setState({
      industries: [],
      temperature: undefined,
      query: '',
      scoreRange: [0, 100],
      page: 1,
      orderBy: 'score',
      order: 'desc',
    })
  })

  it('should render filter panel with title', () => {
    render(<FilterPanel />)
    expect(screen.getByText('Filtros')).toBeInTheDocument()
  })

  it('should render temperature filter options', () => {
    render(<FilterPanel />)
    expect(screen.getByText('Todos')).toBeInTheDocument()
    expect(screen.getByText('Caliente')).toBeInTheDocument()
    expect(screen.getByText('Tibio')).toBeInTheDocument()
    expect(screen.getByText('Frío')).toBeInTheDocument()
  })

  it('should render industry filter checkboxes', () => {
    render(<FilterPanel />)
    expect(screen.getByText('Industria')).toBeInTheDocument()
    expect(screen.getByText('Logística')).toBeInTheDocument()
    expect(screen.getByText('Minería')).toBeInTheDocument()
  })

  it('should apply temperature filter when clicking radio button', () => {
    render(<FilterPanel />)
    const calienteradio = screen.getByRole('radio', { name: /Caliente/i })
    fireEvent.click(calienteradio)
    const state = useRadarFiltersStore.getState()
    expect(state.temperature).toBe('caliente')
  })

  it('should show clear filters button when filters are active', () => {
    const store = useRadarFiltersStore.getState()
    store.setTemperature('caliente')
    render(<FilterPanel />)
    expect(screen.getByText('Limpiar filtros')).toBeInTheDocument()
  })

  it('should clear all filters when clicking clear button', () => {
    const store = useRadarFiltersStore.getState()
    store.setTemperature('caliente')
    store.setIndustries(['mineria'])
    render(<FilterPanel />)
    const clearButton = screen.getByText('Limpiar filtros')
    fireEvent.click(clearButton)
    const state = useRadarFiltersStore.getState()
    expect(state.temperature).toBeUndefined()
    expect(state.industries).toEqual([])
  })

  it('should show active filters count badge', () => {
    const store = useRadarFiltersStore.getState()
    store.setTemperature('caliente')
    store.setIndustries(['mineria', 'logistica'])
    render(<FilterPanel />)
    expect(screen.getByText('3 activos')).toBeInTheDocument()
  })

  it('should update query when typing in search input', async () => {
    render(<FilterPanel />)
    const input = screen.getByPlaceholderText(/Buscar por nombre/i)
    fireEvent.change(input, { target: { value: 'Minera' } })
    expect(input).toHaveValue('Minera')
  })
})

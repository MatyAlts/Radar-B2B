import { describe, it, expect, beforeEach } from 'vitest'
import { useLeadsFiltersStore } from './leads-filters'

describe('useLeadsFiltersStore', () => {
  beforeEach(() => {
    // Reset store state
    useLeadsFiltersStore.setState({
      companyId: undefined,
      titleQuery: '',
      reliability: undefined,
      page: 1,
    })
  })

  it('should have initial state', () => {
    const state = useLeadsFiltersStore.getState()
    expect(state.companyId).toBeUndefined()
    expect(state.titleQuery).toBe('')
    expect(state.reliability).toBeUndefined()
    expect(state.page).toBe(1)
  })

  it('should set individual filters', () => {
    const store = useLeadsFiltersStore.getState()
    store.setFilter('companyId', 'company-1')

    expect(useLeadsFiltersStore.getState().companyId).toBe('company-1')
    expect(useLeadsFiltersStore.getState().page).toBe(1)
  })

  it('should reset page when filter changes', () => {
    const store = useLeadsFiltersStore.getState()
    store.setPage(3)
    expect(useLeadsFiltersStore.getState().page).toBe(3)

    store.setFilter('titleQuery', 'gerente')
    expect(useLeadsFiltersStore.getState().titleQuery).toBe('gerente')
    expect(useLeadsFiltersStore.getState().page).toBe(1)
  })

  it('should reset all filters', () => {
    const store = useLeadsFiltersStore.getState()
    store.setFilter('companyId', 'company-1')
    store.setFilter('titleQuery', 'gerente')
    store.setFilter('reliability', 'high')
    store.setPage(5)

    store.resetFilters()

    const state = useLeadsFiltersStore.getState()
    expect(state.companyId).toBeUndefined()
    expect(state.titleQuery).toBe('')
    expect(state.reliability).toBeUndefined()
    expect(state.page).toBe(1)
  })

  it('should set page independently', () => {
    const store = useLeadsFiltersStore.getState()
    store.setPage(2)

    expect(useLeadsFiltersStore.getState().page).toBe(2)
    // Other filters should not change
    expect(useLeadsFiltersStore.getState().titleQuery).toBe('')
  })

  it('should support multiple filters', () => {
    const store = useLeadsFiltersStore.getState()
    store.setFilter('companyId', 'company-1')
    store.setFilter('titleQuery', 'jefe')
    store.setFilter('reliability', 'high')

    const state = useLeadsFiltersStore.getState()
    expect(state.companyId).toBe('company-1')
    expect(state.titleQuery).toBe('jefe')
    expect(state.reliability).toBe('high')
    expect(state.page).toBe(1)
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import { useRadarFiltersStore } from './radar-filters'

describe('RadarFilters Store', () => {
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

  describe('Filters', () => {
    it('should set industries', () => {
      const store = useRadarFiltersStore.getState()
      store.setIndustries(['mineria', 'logistica'])
      expect(useRadarFiltersStore.getState().industries).toEqual(['mineria', 'logistica'])
    })

    it('should set temperature', () => {
      const store = useRadarFiltersStore.getState()
      store.setTemperature('caliente')
      expect(useRadarFiltersStore.getState().temperature).toBe('caliente')
    })

    it('should set query', () => {
      const store = useRadarFiltersStore.getState()
      store.setQuery('Minera')
      expect(useRadarFiltersStore.getState().query).toBe('Minera')
    })

    it('should set score range', () => {
      const store = useRadarFiltersStore.getState()
      store.setScoreRange([50, 80])
      expect(useRadarFiltersStore.getState().scoreRange).toEqual([50, 80])
    })

    it('should reset page to 1 when setting filters', () => {
      const store = useRadarFiltersStore.getState()
      store.setPage(5)
      store.setIndustries(['mineria'])
      expect(useRadarFiltersStore.getState().page).toBe(1)
    })
  })

  describe('Pagination and Sorting', () => {
    it('should set page', () => {
      const store = useRadarFiltersStore.getState()
      store.setPage(3)
      expect(useRadarFiltersStore.getState().page).toBe(3)
    })

    it('should set order by', () => {
      const store = useRadarFiltersStore.getState()
      store.setOrderBy('name')
      expect(useRadarFiltersStore.getState().orderBy).toBe('name')
    })

    it('should set order', () => {
      const store = useRadarFiltersStore.getState()
      store.setOrder('asc')
      expect(useRadarFiltersStore.getState().order).toBe('asc')
    })
  })

  describe('Reset', () => {
    it('should reset all filters to initial state', () => {
      const store = useRadarFiltersStore.getState()
      store.setIndustries(['mineria'])
      store.setTemperature('caliente')
      store.setQuery('Test')
      store.setScoreRange([50, 80])
      store.setPage(5)

      store.resetFilters()

      const state = useRadarFiltersStore.getState()
      expect(state.industries).toEqual([])
      expect(state.temperature).toBeUndefined()
      expect(state.query).toBe('')
      expect(state.scoreRange).toEqual([0, 100])
      expect(state.page).toBe(1)
      expect(state.orderBy).toBe('score')
      expect(state.order).toBe('desc')
    })
  })

  describe('hasActiveFilters', () => {
    it('should return false when no filters are active', () => {
      const store = useRadarFiltersStore.getState()
      expect(store.hasActiveFilters()).toBe(false)
    })

    it('should return true when industries filter is active', () => {
      const store = useRadarFiltersStore.getState()
      store.setIndustries(['mineria'])
      expect(store.hasActiveFilters()).toBe(true)
    })

    it('should return true when temperature filter is active', () => {
      const store = useRadarFiltersStore.getState()
      store.setTemperature('caliente')
      expect(store.hasActiveFilters()).toBe(true)
    })

    it('should return true when query filter is active', () => {
      const store = useRadarFiltersStore.getState()
      store.setQuery('Minera')
      expect(store.hasActiveFilters()).toBe(true)
    })

    it('should return true when score range is not default', () => {
      const store = useRadarFiltersStore.getState()
      store.setScoreRange([50, 80])
      expect(store.hasActiveFilters()).toBe(true)
    })
  })
})

import { create } from 'zustand'
import { Temperature, Industry } from '@/lib/api/types'

export interface RadarFiltersState {
  industries: Industry[]
  temperature?: Temperature
  query: string
  scoreRange: [number, number]
  page: number
  orderBy: 'name' | 'score' | 'industry'
  order: 'asc' | 'desc'

  // Actions
  setIndustries: (industries: Industry[]) => void
  setTemperature: (temperature?: Temperature) => void
  setQuery: (query: string) => void
  setScoreRange: (range: [number, number]) => void
  setPage: (page: number) => void
  setOrderBy: (orderBy: 'name' | 'score' | 'industry') => void
  setOrder: (order: 'asc' | 'desc') => void
  resetFilters: () => void
  hasActiveFilters: () => boolean
}

const initialState = {
  industries: [],
  temperature: undefined,
  query: '',
  scoreRange: [0, 100] as [number, number],
  page: 1,
  orderBy: 'score' as const,
  order: 'desc' as const,
}

export const useRadarFiltersStore = create<RadarFiltersState>((set, get) => ({
  ...initialState,

  setIndustries: (industries) => set({ industries, page: 1 }),
  setTemperature: (temperature) => set({ temperature, page: 1 }),
  setQuery: (query) => set({ query, page: 1 }),
  setScoreRange: (scoreRange) => set({ scoreRange, page: 1 }),
  setPage: (page) => set({ page }),
  setOrderBy: (orderBy) => set({ orderBy }),
  setOrder: (order) => set({ order }),

  resetFilters: () => set(initialState),

  hasActiveFilters: () => {
    const state = get()
    return (
      state.industries.length > 0 ||
      state.temperature !== undefined ||
      state.query.length > 0 ||
      state.scoreRange[0] !== 0 ||
      state.scoreRange[1] !== 100
    )
  },
}))

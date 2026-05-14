import { create } from 'zustand'

export interface LeadsFiltersState {
  companyId?: string
  titleQuery: string
  reliability?: 'high' | 'medium' | 'low'
  page: number

  setFilter: (key: keyof Omit<LeadsFiltersState, 'setFilter' | 'resetFilters' | 'setPage'>, value: any) => void
  resetFilters: () => void
  setPage: (page: number) => void
}

const initialState = {
  companyId: undefined,
  titleQuery: '',
  reliability: undefined,
  page: 1,
}

export const useLeadsFiltersStore = create<LeadsFiltersState>((set) => ({
  ...initialState,

  setFilter: (key, value) =>
    set((state) => ({
      ...state,
      [key]: value,
      page: 1, // Reset to first page when filter changes
    })),

  resetFilters: () => set(initialState),

  setPage: (page) =>
    set((state) => ({
      ...state,
      page,
    })),
}))

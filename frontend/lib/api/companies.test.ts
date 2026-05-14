import { describe, it, expect, beforeEach, vi } from 'vitest'
import { listCompanies } from './companies'
import { ApiError } from './types'

describe('Companies API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Mock mode', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_API_MOCK = 'true'
    })

    it('should return mock companies when NEXT_PUBLIC_API_MOCK is true', async () => {
      const result = await listCompanies()
      expect(result.data).toBeDefined()
      expect(result.data.length).toBeGreaterThan(0)
      expect(result.total).toBeGreaterThan(0)
      expect(result.page).toBe(1)
      expect(result.page_size).toBe(20)
    })

    it('should filter by industry', async () => {
      const result = await listCompanies({ industries: ['mineria'] })
      expect(result.data.every(c => c.industry === 'mineria')).toBe(true)
    })

    it('should filter by temperature', async () => {
      const result = await listCompanies({ temperature: 'caliente' })
      expect(result.data.every(c => c.temperature === 'caliente')).toBe(true)
    })

    it('should filter by score range', async () => {
      const result = await listCompanies({ score_min: 70, score_max: 80 })
      expect(result.data.every(c => c.score >= 70 && c.score <= 80)).toBe(true)
    })

    it('should filter by query', async () => {
      const result = await listCompanies({ query: 'Minera' })
      expect(result.data.every(c => c.name.toLowerCase().includes('minera'))).toBe(true)
    })

    it('should sort by score descending', async () => {
      const result = await listCompanies({ order_by: 'score', order: 'desc' })
      for (let i = 0; i < result.data.length - 1; i++) {
        expect(result.data[i].score).toBeGreaterThanOrEqual(result.data[i + 1].score)
      }
    })

    it('should sort by score ascending', async () => {
      const result = await listCompanies({ order_by: 'score', order: 'asc' })
      for (let i = 0; i < result.data.length - 1; i++) {
        expect(result.data[i].score).toBeLessThanOrEqual(result.data[i + 1].score)
      }
    })

    it('should paginate correctly', async () => {
      const result = await listCompanies({ page: 1, page_size: 5 })
      expect(result.data.length).toBeLessThanOrEqual(5)
      expect(result.page).toBe(1)
      expect(result.page_size).toBe(5)
    })

    it('should handle empty results', async () => {
      const result = await listCompanies({ query: 'NonexistentCompany' })
      expect(result.data).toEqual([])
      expect(result.total).toBe(0)
    })
  })

  describe('API mode (when NEXT_PUBLIC_API_MOCK is false)', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_API_MOCK = 'false'
    })

    it('should throw ApiError on 404', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ detail: 'Not found' }),
      })

      await expect(listCompanies()).rejects.toThrow(ApiError)
    })

    it('should throw ApiError on 422', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 422,
        json: async () => ({ detail: 'Validation error' }),
      })

      await expect(listCompanies()).rejects.toThrow(ApiError)
    })

    it('should throw ApiError on 500', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ detail: 'Internal server error' }),
      })

      await expect(listCompanies()).rejects.toThrow(ApiError)
    })

    it('should throw ApiError with status code', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ detail: 'Server error' }),
      })

      try {
        await listCompanies()
      } catch (error) {
        if (error instanceof ApiError) {
          expect(error.status).toBe(500)
        }
      }
    })
  })
})

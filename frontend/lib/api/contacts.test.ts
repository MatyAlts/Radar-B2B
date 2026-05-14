import { describe, it, expect, vi, beforeEach } from 'vitest'
import { listContacts } from './contacts'
import { enrichCompany } from './companies'

// Mock the apiFetch function
vi.mock('./client', () => ({
  apiFetch: vi.fn(),
}))

describe('Contacts API', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_MOCK = 'true'
  })

  describe('listContacts', () => {
    it('should return array of contacts for a valid company', async () => {
      const contacts = await listContacts('1')
      expect(Array.isArray(contacts)).toBe(true)
      expect(contacts.length).toBeGreaterThan(0)
      expect(contacts[0]).toHaveProperty('id')
      expect(contacts[0]).toHaveProperty('name')
      expect(contacts[0]).toHaveProperty('title')
      expect(contacts[0]).toHaveProperty('reliability')
    })

    it('should return empty array when company has no contacts', async () => {
      const contacts = await listContacts('7')
      expect(Array.isArray(contacts)).toBe(true)
      expect(contacts.length).toBe(0)
    })

    it('should have properly typed contacts with all required fields', async () => {
      const contacts = await listContacts('1')
      const contact = contacts[0]

      expect(contact.id).toBeDefined()
      expect(contact.company_id).toBeDefined()
      expect(contact.name).toBeDefined()
      expect(contact.title).toBeDefined()
      expect(['high', 'medium', 'low']).toContain(contact.reliability)
      expect(contact.last_updated_at).toBeDefined()
    })

    it('should have optional email and phone fields', async () => {
      const contacts = await listContacts('1')
      const contactWithEmail = contacts.find(c => c.email)
      const contactWithPhone = contacts.find(c => c.phone)

      expect(contactWithEmail?.email).toBeDefined()
      expect(contactWithPhone?.phone).toBeDefined()
    })
  })

  describe('enrichCompany', () => {
    it('should complete successfully for a valid company', async () => {
      await expect(enrichCompany('1')).resolves.not.toThrow()
    })

    it('should handle successful enrichment', async () => {
      process.env.NEXT_PUBLIC_API_MOCK = 'true'
      const result = await enrichCompany('1')
      expect(result).toBeUndefined()
    })
  })
})

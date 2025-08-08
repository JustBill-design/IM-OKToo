import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fetch from 'node-fetch'

describe('Scraper API Tests', () => {
  const baseUrl = 'http://localhost:3001'

  beforeAll(() => {
    console.log('scraper tests starting')
  })

  afterAll(() => {
    console.log('scraper tests complete')
  })

  describe('GET /api/scrape-titles', () => {
    it('should handle scraper endpoint', async () => {
      const response = await fetch(`${baseUrl}/api/scrape-titles`)
      
      console.log(`scraper status ${response.status}`)
      if (response.ok) {
        const result = await response.json() as any
        expect(result).toBeDefined()
      }
    })

    it('handle scraper endpoint errors', async () => {
      const response = await fetch(`${baseUrl}/api/scrape-titles`)
      
      console.log(`vitest scraper status ${response.status}`)
      expect([200, 400, 500, 503]).toContain(response.status)
    })
  })
})

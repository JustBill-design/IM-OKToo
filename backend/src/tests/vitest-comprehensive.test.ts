import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fetch from 'node-fetch'

describe(' vitest backend tests', () => {
  const baseUrl = 'http://localhost:3001'

  beforeAll(() => {
    console.log('vitest backend tests starting')
  })

  afterAll(() => {
    console.log('vitest backend tests complete')
  })

  describe('posts api with vitest', () => {
    it('should get all posts', async () => {
      const response = await fetch(`${baseUrl}/posts`)
      
      console.log(`vitest posts status ${response.status}`)
      expect(response.status).toBe(200)
      
      if (response.ok) {
        const posts = await response.json() as any[]
        console.log(`vitest posts count ${posts.length}`)
        expect(Array.isArray(posts)).toBe(true)
      }
    })

    it('should get categories', async () => {
      const response = await fetch(`${baseUrl}/posts/categories`)
      
      console.log(`vitest categories status ${response.status}`)
      expect(response.status).toBe(200)
      
      if (response.ok) {
        const categories = await response.json() as any[]
        console.log(`vitest categories count ${categories.length}`)
        expect(Array.isArray(categories)).toBe(true)
      }
    })
  })

  describe('tasks api with vitest', () => {
    it('should get all tasks', async () => {
      const response = await fetch(`${baseUrl}/tasks`)
      
      console.log(`vitest tasks status ${response.status}`)
      
      if (response.ok) {
        const tasks = await response.json() as any[]
        console.log(`vitest tasks count ${tasks.length}`)
        expect(Array.isArray(tasks)).toBe(true)
      }
    })
  })

  describe('calendar api with vitest', () => {
    it('should get calendar events', async () => {
      const response = await fetch(`${baseUrl}/calendar/all`)
      
      console.log(`vitest calendar status ${response.status}`)
      
      if (response.ok) {
        const events = await response.json() as any[]
        console.log(`vitest events count ${events.length}`)
        expect(Array.isArray(events)).toBe(true)
      }
    })

    it('should test calendar endpoint', async () => {
      const response = await fetch(`${baseUrl}/calendar/testing`)
      
      console.log(`vitest calendar test status ${response.status}`)
      expect(response.status).toBe(200)
    })
  })

  describe('claude api with vitest', () => {
    it('should handle claude chat', async () => {
      const chatData = {
        message: 'help with caretaking advice for elderly parent',
        conversation_id: null,
        username: 'vitest_caregiver',
        email: 'mymail@sutd.edu.sg'
      }

      const response = await fetch(`${baseUrl}/claude`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chatData)
      })

      console.log(`vitest claude status ${response.status}`)
      
      if (response.ok) {
        const result = await response.json() as any
        console.log(`vitest claude response received`)
        expect(result).toBeDefined()
      }
    })
  })

  describe('scraper api with vitest', () => {
    it('should access scraper endpoint', async () => {
      const response = await fetch(`${baseUrl}/scraper`)
      
      console.log(`vitest scraper status ${response.status}`)
      
      if (response.ok) {
        const result = await response.json() as any
        console.log(`vitest scraper response received`)
        expect(result).toBeDefined()
      }
    })
  })

  describe('edge cases with vitest', () => {
    it('should handle 404 endpoints', async () => {
      const response = await fetch(`${baseUrl}/nonexistent`)
      
      console.log(`vitest 404 test status ${response.status}`)
      expect(response.status).toBe(404)
    })

    it('should handle malformed json', async () => {
      const response = await fetch(`${baseUrl}/posts/addposts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json'
      })

      console.log(`vitest malformed json status ${response.status}`)
      expect([400, 500]).toContain(response.status)
    })
  })
})

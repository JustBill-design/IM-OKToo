import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fetch from 'node-fetch'

describe('Backend API Smoke Tests', () => {
  const baseUrl = 'http://localhost:3001'

  beforeAll(() => {
    console.log('smoke tests starting')
  })

  afterAll(() => {
    console.log('smoke tests complete')
  })

  describe('Basic API', () => {
    it('shld verify posts API is responding', async () => {
      const response = await fetch(`${baseUrl}/posts`)
      
      console.log(`smoke test: posts status ${response.status}`)
      expect([200, 500]).toContain(response.status) 
    })

    it('categories endpoint is responding', async () => {
      const response = await fetch(`${baseUrl}/posts/categories`)
      
      console.log(`smoke test: categories status ${response.status}`)
      expect([200, 500]).toContain(response.status)
    })

    it('tasks API is responding', async () => {
      const response = await fetch(`${baseUrl}/api/tasks`)
      
      console.log(`smoke test: tasks status ${response.status}`)
      expect([200, 400, 500]).toContain(response.status)
    })

    it('calendar API is responsive', async () => {
      const response = await fetch(`${baseUrl}/calendar/testing`)
      
      console.log(`smoke test: calendar status ${response.status}`)
      expect([200, 500]).toContain(response.status)
    })

    it('should verify claude API is responding', async () => {
      const chatData = {
        message: 'test message for claude',
        username: 'smoke_test',
        email: 'mymail@sutd.edu.sg'
      }

      const response = await fetch(`${baseUrl}/claude`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chatData)
      })

      console.log(`smoke test: claude status ${response.status}`)
      expect([200, 400, 500]).toContain(response.status)
    })

    it('auth endpoints are responding', async () => {
      const response = await fetch(`${baseUrl}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@sutd.edu.sg', password: 'test' })
      })

      console.log(`smoke test: auth status ${response.status}`)
      expect([200, 400, 401, 500]).toContain(response.status)
    })
  })

  describe('System Health Checks', () => {
    it('should handle 404 for non-existent routes', async () => {
      const response = await fetch(`${baseUrl}/nonexistent`)
      
      console.log(`smoke test: 404 status ${response.status}`)
      expect(response.status).toBe(404)
    })

    it('basic malformed requests', async () => {
      const response = await fetch(`${baseUrl}/posts/addposts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json'
      })

      console.log(`smoke test request status ${response.status}`)
      expect([400, 422, 500]).toContain(response.status)
    })

    it('system responsiveness', async () => {
      const startTime = Date.now()
      const response = await fetch(`${baseUrl}/posts`)
      const responseTime = Date.now() - startTime

      console.log(`smoke test: response time ${responseTime}ms`)
      expect(responseTime).toBeLessThan(30000) //within 30 seconds
      expect([200, 500]).toContain(response.status)
    })
  })
})

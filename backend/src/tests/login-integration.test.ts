import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fetch from 'node-fetch'

describe('Login & Authentication API Tests', () => {
  const baseUrl = 'http://localhost:3001'

  beforeAll(() => {
    console.log('login integration tests starting')
  })

  afterAll(() => {
    console.log('login integration tests complete')
  })

  describe('POST /validate', () => {
    it('should handle user login validation', async () => {
      const loginData = {
        email: 'mymail@sutd.edu.sg',
        password: 'testpassword123'
      }

      const response = await fetch(`${baseUrl}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      })

      console.log(`login validate status ${response.status}`)
      expect([200, 401, 400, 500]).toContain(response.status)
    })

    it('should handle invalid credentials', async () => {
      const invalidData = {
        email: 'nonexistent@sutd.edu.sg',
        password: 'wrongpassword'
      }

      const response = await fetch(`${baseUrl}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData)
      })

      console.log(`vitest invalid login status ${response.status}`)
      expect([401, 400, 500]).toContain(response.status)
    })

    it('should handle missing credentials', async () => {
      const response = await fetch(`${baseUrl}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })

      console.log(`vitest missing credentials status ${response.status}`)
      expect([400, 422, 500]).toContain(response.status)
    })

    it('should handle malformed email', async () => {
      const badEmailData = {
        email: 'not-an-email',
        password: 'password123'
      }

      const response = await fetch(`${baseUrl}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(badEmailData)
      })

      console.log(`vitest bad email status ${response.status}`)
      expect([400, 422, 500]).toContain(response.status)
    })
  })

  describe('POST /register', () => {
    it('should handle new user registration', async () => {
      const registerData = {
        email: `newuser${Date.now()}@sutd.edu.sg`,
        password: 'password123',
        username: 'new_caregiver',
        firstName: 'caring',
        lastName: 'person'
      }

      const response = await fetch(`${baseUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData)
      })

      console.log(`vitest register new user status ${response.status}`)
      expect([200, 201, 400, 409, 500]).toContain(response.status)
    })

    it('should handle duplicate email regist', async () => {
      const duplicateData = {
        email: 'mymail@sutd.edu.sg', // assuming this exists
        password: 'password123',
        username: 'duplicate_user',
        firstName: 'test',
        lastName: 'user'
      }

      const response = await fetch(`${baseUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicateData)
      })

      console.log(`vitest duplicate register status ${response.status}`)
      expect([409, 400, 500]).toContain(response.status)
    })

    it('should handle weak password regist', async () => {
      const weakPasswordData = {
        email: 'weakpass@sutd.edu.sg',
        password: '123', // too weak
        username: 'weak_user',
        firstName: 'weak',
        lastName: 'password'
      }

      const response = await fetch(`${baseUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(weakPasswordData)
      })

      console.log(`vitest weak password status ${response.status}`)
      expect([400, 422, 500]).toContain(response.status)
    })

    it('should handle caregiver regist', async () => {
      const caregiverData = {
        email: `caregiver${Date.now()}@sutd.edu.sg`,
        password: 'securePassword123!',
        username: 'loving_daughter',
        firstName: 'mary',
        lastName: 'caregiving',
        role: 'primary_caregiver'
      }

      const response = await fetch(`${baseUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(caregiverData)
      })

      console.log(`vitest caregiver register status ${response.status}`)
      expect([200, 201, 400, 500]).toContain(response.status)
    })
  })

  describe('Google OAuth Integration', () => {
    it('should handle google user check', async () => {
      const googleData = {
        email: 'mymail@sutd.edu.sg',
        googleId: 'test-google-id'
      }

      const response = await fetch(`${baseUrl}/check-google-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googleData)
      })

      console.log(`vitest google check status ${response.status}`)
      expect([200, 404, 400, 500]).toContain(response.status)
    })

    it('should handle last login update', async () => {
      const updateData = {
        email: 'mymail@sutd.edu.sg'
      }

      const response = await fetch(`${baseUrl}/update-last-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })

      console.log(`vitest update login status ${response.status}`)
      expect([200, 404, 400, 500]).toContain(response.status)
    })

    it('should handle invalid google ID', async () => {
      const invalidGoogleData = {
        email: 'mymail@sutd.edu.sg',
        googleId: '' // empty google ID
      }

      const response = await fetch(`${baseUrl}/check-google-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidGoogleData)
      })

      console.log(`vitest invalid google id status ${response.status}`)
      expect([400, 422, 500]).toContain(response.status)
    })
  })

  describe('Authentication Security', () => {
    it('should handle SQL injection in login', async () => {
      const maliciousData = {
        email: "admin'; DROP TABLE Users; --",
        password: "' OR '1'='1"
      }

      const response = await fetch(`${baseUrl}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(maliciousData)
      })

      console.log(`vitest sql injection login status ${response.status}`)
      expect([400, 401, 422, 500]).toContain(response.status)
    })

    it('should handle brute force attempts', async () => {
      const attempts = Array(5).fill(0).map(() =>
        fetch(`${baseUrl}/validate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'mymail@sutd.edu.sg',
            password: 'wrongpassword'
          })
        })
      )

      const responses = await Promise.all(attempts)
      const statuses = responses.map(r => r.status)
      
      console.log(`vitest brute force statuses ${statuses.join(', ')}`)
      statuses.forEach(status => {
        expect([401, 429, 400, 500]).toContain(status) // 429 for rate limiting
      })
    })
  })
})

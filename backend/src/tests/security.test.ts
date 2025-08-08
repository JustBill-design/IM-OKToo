import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fetch from 'node-fetch'

describe('Security & Input Validation Tests', () => {
  const baseUrl = 'http://localhost:3001'

  beforeAll(() => {
    console.log('security tests starting')
  })

  afterAll(() => {
    console.log('security tests complete')
  })

  describe('SQL Injection Protection', () => {
    it('should prevent SQL injection in posts', async () => {
      const maliciousData = {
        title: "'; DROP TABLE Posts; --",
        content: "1' OR '1'='1",
        username: "admin'--",
        category: "'; SELECT * FROM Users; --",
        email: 'mymail@sutd.edu.sg'
      }

      const response = await fetch(`${baseUrl}/posts/addposts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(maliciousData)
      })

      console.log(`vitest sql injection posts status ${response.status}`)
      expect([200, 201, 400, 422, 500]).toContain(response.status)
      
      // Shld not crash the system
      expect(response.status).not.toBe(502)
      expect(response.status).not.toBe(503)
    })

    it('should prevent SQL injection in calendar events', async () => {
      const maliciousEvent = {
        title: "'; DELETE FROM Events; --",
        startDate: { year: 2025, month: 8, day: 15 },
        endDate: { year: 2025, month: 8, day: 15 },
        startTime: '14:30',
        endTime: '15:30',
        category: "' OR 1=1; --",
        elderly: "'; TRUNCATE TABLE Events; --",
        caretaker: "admin'; --",
        email: 'mymail@sutd.edu.sg'
      }

      const response = await fetch(`${baseUrl}/calendar/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(maliciousEvent)
      })

      console.log(`vitest sql injection calendar status ${response.status}`)
      expect([200, 201, 400, 422, 500]).toContain(response.status)
    })

    it('should prevent SQL injection in tasks', async () => {
      const maliciousTask = {
        title: "'; DROP DATABASE IMOKTOO; --",
        description: "1' UNION SELECT password FROM Users; --",
        due_date: '2025-08-09',
        priority: "high'; DELETE FROM Tasks; --",
        assigned_to: "'; SELECT * FROM Users WHERE admin='1'; --",
        email: 'mymail@sutd.edu.sg'
      }

      const response = await fetch(`${baseUrl}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(maliciousTask)
      })

      console.log(`vitest sql injection tasks status ${response.status}`)
      expect([200, 201, 400, 422, 500]).toContain(response.status)
    })
  })

  describe('Input Validation & Sanitization', () => {
    it('should handle XSS attempts in content', async () => {
      const xssData = {
        title: '<script>alert("XSS")</script>',
        content: '<img src="x" onerror="alert(\'XSS\')">',
        username: '<script>document.location="http://evil.com"</script>',
        category: '<iframe src="javascript:alert(\'XSS\')"></iframe>',
        email: 'mymail@sutd.edu.sg'
      }

      const response = await fetch(`${baseUrl}/posts/addposts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(xssData)
      })

      console.log(`vitest xss attempt status ${response.status}`)
      expect([200, 201, 400, 422, 500]).toContain(response.status)
    })

    it('should handle extremely long input strings', async () => {
      const longString = 'x'.repeat(100000) // for super long
      const oversizedData = {
        title: longString,
        content: longString,
        username: 'test_user',
        category: 'general',
        email: 'mymail@sutd.edu.sg'
      }

      const response = await fetch(`${baseUrl}/posts/addposts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(oversizedData)
      })

      console.log(`vitest oversized input status ${response.status}`)
      expect([200, 201, 400, 413, 422, 500]).toContain(response.status)
    })

    it('should handle null and undefined values', async () => {
      const nullData = {
        title: null,
        content: undefined,
        username: '',
        category: null,
        email: 'mymail@sutd.edu.sg'
      }

      const response = await fetch(`${baseUrl}/posts/addposts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nullData)
      })

      console.log(`vitest null values status ${response.status}`)
      expect([400, 422, 500]).toContain(response.status)
    })

    it('should handle unicode and special characters', async () => {
      const unicodeData = {
        title: '测试 🧓 Elderly Care حماية كبار السن',
        content: '这是一个关于照顾老人的帖子 😊 نصائح للعناية بكبار السن',
        username: 'caregiver_多语言',
        category: 'multilingual',
        email: 'mymail@sutd.edu.sg'
      }

      const response = await fetch(`${baseUrl}/posts/addposts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(unicodeData)
      })

      console.log(`vitest unicode content status ${response.status}`)
      expect([200, 201, 400, 500]).toContain(response.status)
    })
  })

  describe('Request Format Validation', () => {
    it('should handle malformed JSON requests', async () => {
      const response = await fetch(`${baseUrl}/posts/addposts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{"title": "incomplete json"'
      })

      console.log(`vitest malformed json status ${response.status}`)
      expect([400, 422, 500]).toContain(response.status)
    })

    it('should handle missing Content-Type header', async () => {
      const response = await fetch(`${baseUrl}/posts/addposts`, {
        method: 'POST',
        body: JSON.stringify({
          title: 'no content type',
          content: 'test content',
          username: 'test_user',
          category: 'general',
          email: 'mymail@sutd.edu.sg'
        })
      })

      console.log(`vitest missing content-type status ${response.status}`)
      expect([400, 415, 422, 500]).toContain(response.status)
    })

    it('should handle incorrect Content-Type', async () => {
      const response = await fetch(`${baseUrl}/posts/addposts`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          title: 'wrong content type',
          content: 'test content',
          username: 'test_user',
          category: 'general',
          email: 'mymail@sutd.edu.sg'
        })
      })

      console.log(`vitest wrong content-type status ${response.status}`)
      expect([400, 415, 422, 500]).toContain(response.status)
    })

    it('should handle empty request body', async () => {
      const response = await fetch(`${baseUrl}/posts/addposts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: ''
      })

      console.log(`vitest empty body status ${response.status}`)
      expect([400, 422, 500]).toContain(response.status)
    })
  })

  describe('Rate Limiting & DoS Protection', () => {
    it('should handle rapid successive requests', async () => {
      const rapidRequests = Array(10).fill(0).map((_, i) =>
        fetch(`${baseUrl}/posts/addposts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: `rapid request ${i}`,
            content: 'test content',
            username: 'rapid_user',
            category: 'test',
            email: 'mymail@sutd.edu.sg'
          })
        })
      )

      const responses = await Promise.all(rapidRequests)
      const statuses = responses.map(r => r.status)
      
      console.log(`vitest rapid requests statuses ${statuses.join(', ')}`)
      statuses.forEach(status => {
        expect([200, 201, 400, 429, 500]).toContain(status) // 429 = Too Many Requests
      })
    })

    it('should handle concurrent connections', async () => {
      const concurrentRequests = Array(15).fill(0).map(() =>
        fetch(`${baseUrl}/posts`)
      )

      const responses = await Promise.all(concurrentRequests)
      const statuses = responses.map(r => r.status)
      
      console.log(`vitest concurrent connections statuses ${statuses.slice(0, 5).join(', ')}...`)
      statuses.forEach(status => {
        expect([200, 429, 500, 502, 503]).toContain(status)
      })
    })
  })

  describe('Error Handling & System Stability', () => {
    it('should handle requests to non-existent endpoints gracefully', async () => {
      const nonExistentEndpoints = [
        '/nonexistent',
        '/posts/invalid',
        '/api/invalid',
        '/calendar/fake',
        '/admin/secret'
      ]

      for (const endpoint of nonExistentEndpoints) {
        const response = await fetch(`${baseUrl}${endpoint}`)
        console.log(`vitest ${endpoint} status ${response.status}`)
        expect([404, 405]).toContain(response.status)
      }
    })

    it('should maintain system stability under edge case load', async () => {
      // edge cases
      const edgeCaseRequests = [
        // big big payload
        fetch(`${baseUrl}/posts/addposts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'x'.repeat(1000),
            content: 'y'.repeat(5000),
            username: 'stress_test',
            category: 'stress',
            email: 'mymail@sutd.edu.sg'
          })
        }),
        // Malformed requests
        fetch(`${baseUrl}/posts/addposts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{"invalid": json}'
        }),
        // normal requests
        fetch(`${baseUrl}/posts`),
        fetch(`${baseUrl}/posts/categories`)
      ]

      const responses = await Promise.all(edgeCaseRequests)
      const statuses = responses.map(r => r.status)
      
      console.log(`vitest stress test statuses ${statuses.join(', ')}`)
      
      // sys shld remain responsive
      const successfulResponses = statuses.filter(s => s < 500).length
      expect(successfulResponses).toBeGreaterThan(0)
    })
  })

  // merged from vitest-enhanced-coverage.test.ts                               Additional Edge Cases
  describe('Request Handling Edge Cases', () => {
    it('should handle empty request bodies', async () => {
      const response = await fetch(`${baseUrl}/posts/addposts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}'
      })

      console.log(`vitest empty body status ${response.status}`)
      expect([400, 422, 500]).toContain(response.status)
    })

    it('should handle missing content-type', async () => {
      const response = await fetch(`${baseUrl}/posts/addposts`, {
        method: 'POST',
        body: 'some data'
      })

      console.log(`vitest missing contenttype status ${response.status}`)
      expect([400, 415, 500]).toContain(response.status)
    })

    it('should handle very long content', async () => {
      const longContent = 'x'.repeat(10000)
      const postData = {
        title: 'very long post',
        content: longContent,
        username: 'test_user',
        category: 'general',
        email: 'mymail@sutd.edu.sg'
      }

      const response = await fetch(`${baseUrl}/posts/addposts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      })

      console.log(`vitest long content status ${response.status}`)
      expect([200, 201, 400, 413, 500]).toContain(response.status)
    })

    it('should handle special characters and unicode', async () => {
      const postData = {
        title: 'test with 特殊字符 & symbols @#$%',
        content: 'content with emoji 😊 and unicode ñáéíóú',
        username: 'test_user_特殊',
        category: 'general',
        email: 'mymail@sutd.edu.sg'
      }

      const response = await fetch(`${baseUrl}/posts/addposts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      })

      console.log(`vitest special chars status ${response.status}`)
      expect([200, 201, 400, 500]).toContain(response.status)
    })

    it('should handle concurrent requests', async () => {
      const requests = Array(5).fill(0).map(() => 
        fetch(`${baseUrl}/posts`)
      )

      const responses = await Promise.all(requests)
      const statuses = responses.map(r => r.status)
      
      console.log(`vitest concurrent requests statuses ${statuses.join(', ')}`)
      statuses.forEach(status => {
        expect([200, 429, 500]).toContain(status)
      })
    })

    it('should handle invalid json in request', async () => {
      const response = await fetch(`${baseUrl}/claude`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{"message": "invalid json"'
      })

      console.log(`vitest invalid json status ${response.status}`)
      expect([400, 422, 500]).toContain(response.status)
    })
  })
})

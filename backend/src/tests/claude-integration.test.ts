import request from 'supertest'
import express from 'express'
import claudeRouter from '../../routes/claude'

const app = express()
app.use(express.json())
app.use('/claude', claudeRouter)




describe('Claude Cchatbot integration tests', () => {

  describe('POST /claude/', () => {
    it('should require message in request body', async () => {
      const response = await request(app)
        .post('/claude')
        .send({})
        .expect(400)
      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toContain('Missing message')
    })

    it('should handle valid message', async () => {
      const testMessage = 'Hello, can you help me with elderly care tips?'
      
      const response = await request(app)
        .post('/claude')
        .send({ message: testMessage })

      // Should return response 
      expect([200, 400, 401, 429, 500]).toContain(response.status)
      
      if (response.status === 200) {
        // Check for both 'response' and 'reply'
        expect(response.body).toSatisfy((body: any) => 
          body.hasOwnProperty('response') || body.hasOwnProperty('reply'))
        
        const aiResponse = (response.body.response || response.body.reply)
        expect(typeof aiResponse).toBe('string')
        expect(aiResponse.length).toBeGreaterThan(0)
        const aiResponseLower = aiResponse.toLowerCase()
        expect(
          aiResponseLower.includes('leo') || 
          aiResponseLower.includes('caregiver') ||
          aiResponseLower.includes('assist')
        ).toBe(true)
      }
    }, 30000) 

    it('should handle caregiving queries', async () => {
      const caregivingMessage = 'My elderly parent has dementia. What are some daily care tips?'
      
      const response = await request(app)
        .post('/claude')
        .send({ message: caregivingMessage })

      if (response.status === 200) {
        
        expect(response.body).toSatisfy((body: any) => 
          body.hasOwnProperty('response') || body.hasOwnProperty('reply'))
        
        const aiResponse = (response.body.response || response.body.reply)
        const aiResponseLower = aiResponse.toLowerCase()
        expect(
          aiResponseLower.includes('dementia') || 
          aiResponseLower.includes('care') ||
          aiResponseLower.includes('routine') ||
          aiResponseLower.includes('patient')
        ).toBe(true)
      }
    }, 30000)



    it('should maintain Leo the Lion persona', async () => {
      const response = await request(app)
        .post('/claude')
        .send({ message: 'Who are you?' })

      if (response.status === 200) {
        
        const aiResponse = (response.body.response || response.body.reply)
        if (aiResponse) {
          const aiResponseLower = aiResponse.toLowerCase()
          expect(
            aiResponseLower.includes('leo') ||
            aiResponseLower.includes('lion') ||
            aiResponseLower.includes('lions befrienders') ||
            aiResponseLower.includes('singapore')
          ).toBe(true)
        }
      }
    }, 30000)

    it('should handle API key config', () => {
      expect(process.env.CLAUDE_API_KEY).toBeDefined()
      expect(process.env.CLAUDE_API_KEY).toMatch(/^sk-ant-/)
    })

    it('should handle rate limiting gracefully', async () => {
      const requests = Array(3).fill(null).map(() => 
        request(app)
          .post('/claude')
          .send({ message: 'Quick test message' })
      )

      const responses = await Promise.allSettled(requests)
      
      responses.forEach(result => {
        if (result.status === 'fulfilled') {
          expect([200, 429, 500]).toContain(result.value.status)
        }
      })
    }, 45000)

    it('should handle long messages', async () => {
      const longMessage = 'A'.repeat(1000) + ' Can you help with elderly care?'
      
      const response = await request(app)
        .post('/claude')
        .send({ message: longMessage })
      expect([200, 400, 413, 500]).toContain(response.status)
    }, 30000)
  })

  describe('Error Handling', () => {
    it('should handle network timeouts gracefully', async () => {
      const response = await request(app)
        .post('/claude')
        .send({ message: 'Test timeout handling' })
        .timeout(5000) // 5 s
      expect([200, 400, 500, 408]).toContain(response.status)
    })
  })
})

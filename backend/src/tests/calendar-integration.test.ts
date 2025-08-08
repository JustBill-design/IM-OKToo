import request from 'supertest'
import express from 'express'
import calendarRouter from '../../routes/calendar'
import getConnection from '../db'



const app = express()
app.use(express.json())
app.use('/calendar', calendarRouter)

describe('Calendar API integration tests', () => {
  let db: any

  beforeAll(async () => {
    db = await getConnection()
    console.log('Connect calendar testing')
  })

  afterAll(async () => {
    if (db && db.end) {
      await db.end()
    }
  })

  describe('GET /calendar/all', () => {
    it('should require email parameter', async () => {
      const response = await request(app)
        .get('/calendar/all')
        .expect(400)

      expect(response.text).toContain('Missing email')
    })

    it('shld fetch events for valid email', async () => {
      const testEmail = 'su.jessica69@gmail.com'
      
      const response = await request(app)
        .get(`/calendar/all?email=${testEmail}`)
      expect([200, 404]).toContain(response.status)

      if (response.status === 200) {
        expect(Array.isArray(response.body)).toBe(true)
      }
    })

    it('should handle database queries correctly', async () => {
      const testEmail = 'sutd.imoktoo@gmail.com'
      
      const response = await request(app)
        .get(`/calendar/all?email=${testEmail}`)
      expect([200, 404]).toContain(response.status)
      
      if (response.status === 200 && response.body.length > 0) {
        const event = response.body[0]
        expect(event).toHaveProperty('email')
        expect(event.email).toBe(testEmail)
      }
    })
  })

  describe('Google Calendar Integration', () => {
    it('should handle OAuth config', () => {
      expect(process.env.CLIENT_ID).toBeDefined()
      expect(process.env.SECRET_ID).toBeDefined()
      expect(process.env.REDIRECT).toBeDefined()
    })

    it('should handle calendar API endpt', async () => {
      const response = await request(app)
        .get('/calendar/auth')
      expect([200, 302, 400, 401]).toContain(response.status)
    })
  })
})

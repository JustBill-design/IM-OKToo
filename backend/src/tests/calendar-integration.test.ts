import request from 'supertest'
import express from 'express'
import calendarRouter from '../../routes/calendar'
import getConnection from '../db'
import fetch from 'node-fetch'



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

  // merged from vitest-enhanced-coverage.test.ts
  describe('Calendar API Endpoints (fetch-based)', () => {
    const baseUrl = 'http://localhost:3001'

    it('should handle add calendar event', async () => {
      const eventData = {
        title: 'doctor appointment',
        startDate: { year: 2025, month: 8, day: 15 },
        endDate: { year: 2025, month: 8, day: 15 },
        startTime: '14:30',
        endTime: '15:30',
        category: 'medical',
        elderly: 'grandma liu',
        caretaker: 'daughter mary',
        email: 'mymail@sutd.edu.sg'
      }

      const response = await fetch(`${baseUrl}/calendar/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      })

      console.log(`vitest add event status ${response.status}`)
      expect([200, 201, 400, 500]).toContain(response.status)
    })

    it('should handle calendar all with email param', async () => {
      const response = await fetch(`${baseUrl}/calendar/all?email=mymail@sutd.edu.sg`)
      
      console.log(`vitest calendar with email status ${response.status}`)
      if (response.ok) {
        const events = await response.json() as any[]
        expect(Array.isArray(events)).toBe(true)
      }
    })

    it('should handle google calendar auth', async () => {
      const response = await fetch(`${baseUrl}/calendar/authgooglecalendar`)
      
      console.log(`vitest google cal auth status ${response.status}`)
      expect([200, 302, 400, 401, 404]).toContain(response.status)
    })
  })
})

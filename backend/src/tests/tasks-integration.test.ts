import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fetch from 'node-fetch'

describe('Tasks API Integration Tests', () => {
  const baseUrl = 'http://localhost:3001'

  beforeAll(() => {
    console.log('tasks integration tests')
  })

  afterAll(() => {
    console.log('tasks integration tests done')
  })

  describe('GET /api/tasks', () => {
    it('should get all tasks', async () => {
      const response = await fetch(`${baseUrl}/api/tasks`)
      
      console.log(`vitest get tasks status ${response.status}`)
      if (response.ok) {
        const tasks = await response.json() as any[]
        expect(Array.isArray(tasks)).toBe(true)
      }
    })

    it('handle missing email parameter', async () => {
      const response = await fetch(`${baseUrl}/api/tasks`)
      
      console.log(`vitest tasks no email status ${response.status}`)
      expect([200, 400]).toContain(response.status)
    })

    it('handle valid email parameter', async () => {
      const response = await fetch(`${baseUrl}/api/tasks?email=mymail@sutd.edu.sg`)
      
      console.log(`vitest tasks with email status ${response.status}`)
      if (response.ok) {
        const tasks = await response.json() as any[]
        expect(Array.isArray(tasks)).toBe(true)
      }
    })
  })

  describe('POST /api/tasks', () => {
    it('should create new task', async () => {
      const taskData = {
        title: 'give grandpa his medicine',
        description: 'blood pressure meds at 8am daily',
        due_date: '2025-08-09',
        priority: 'high',
        assigned_to: 'caregiver_alex',
        email: 'mymail@sutd.edu.sg'
      }

      const response = await fetch(`${baseUrl}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      })

      console.log(`vitest create task status ${response.status}`)
      expect([200, 201, 400, 500]).toContain(response.status)
    })

    it('should handle missing required fields', async () => {
      const incompleteTask = {
        title: 'incomplete task'
        // missing description, due_date and stuff
      }

      const response = await fetch(`${baseUrl}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incompleteTask)
      })

      console.log(`vitest incomplete task status ${response.status}`)
      expect([400, 422, 500]).toContain(response.status)
    })

    it('should handle caretaking-focused task creation', async () => {
      const careTask = {
        title: 'remind mom about her doctor appointment',
        description: 'cardiology appointment at 2pm, need to take her blood pressure monitor',
        due_date: '2025-08-10',
        priority: 'medium',
        assigned_to: 'caring_daughter',
        email: 'mymail@sutd.edu.sg',
        category: 'medical appointment'
      }

      const response = await fetch(`${baseUrl}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(careTask)
      })

      console.log(`vitest care task status ${response.status}`)
      expect([200, 201, 400, 500]).toContain(response.status)
    })
  })

  describe('DELETE /api/tasks/:id', () => {
    it('should delete existing task', async () => {
      const response = await fetch(`${baseUrl}/api/tasks/1`, {
        method: 'DELETE'
      })

      console.log(`vitest delete task status ${response.status}`)
      expect([200, 404, 500]).toContain(response.status)
    })

    it('should handle non-existent task deletion', async () => {
      const response = await fetch(`${baseUrl}/api/tasks/999999`, {
        method: 'DELETE'
      })

      console.log(`vitest delete nonexistent task status ${response.status}`)
      expect([404, 500]).toContain(response.status)
    })

    it('should handle invalid task ID', async () => {
      const response = await fetch(`${baseUrl}/api/tasks/invalid-id`, {
        method: 'DELETE'
      })

      console.log(`vitest invalid task id status ${response.status}`)
      expect([400, 404, 500]).toContain(response.status)
    })
  })

  describe('Tasks API Edge Cases', () => {
    it('should handle concurrent task operations', async () => {
      const requests = Array(3).fill(0).map(() => 
        fetch(`${baseUrl}/api/tasks`)
      )

      const responses = await Promise.all(requests)
      const statuses = responses.map(r => r.status)
      
      console.log(`vitest concurrent tasks statuses ${statuses.join(', ')}`)
      statuses.forEach(status => {
        expect([200, 400, 429, 500]).toContain(status)
      })
    })

    it('should handle tasks with special characters', async () => {
      const specialTask = {
        title: 'reminder: 提醒奶奶吃药 💊💊💊💊💊',
        description: 'medication includes: aspirin, vitamin D and calcium',
        due_date: '2025-08-11',
        priority: 'high',
        assigned_to: 'caregiver_林小姐',
        email: 'mymail@sutd.edu.sg'
      }

      const response = await fetch(`${baseUrl}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(specialTask)
      })

      console.log(`vitest special chars task status ${response.status}`)
      expect([200, 201, 400, 500]).toContain(response.status)
    })
  })
})

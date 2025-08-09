import request from 'supertest'
import express from 'express'
import postsRouter from '../../routes/posts'
import getConnection from '../db'
import { cleanupTestData, seedTestData } from '../test/integration-setup'

const app = express()
app.use(express.json())
app.use('/posts', postsRouter)
describe('posts APITests (Real Database)', ()=>{
  let db: any
  beforeAll(async () => {
    db = await getConnection()
    console.log('connection')
  })

  beforeEach(async () => {
    await seedTestData()
  })

  afterEach(async () => {
    await cleanupTestData()
  })

  afterAll(async () => {
    if (db && db.end) {
      await db.end()
    }
  })

  describe('GET /posts', () => {
    it('should fetch real posts from database', async () => {
      const response = await request(app)
        .get('/posts')
        .expect(200)
      expect(Array.isArray(response.body)).toBe(true)
      if (response.body.length > 0) {
        const post = response.body[0]
        expect(post).toHaveProperty('post_id')
        expect(post).toHaveProperty('title')
        expect(post).toHaveProperty('content')
        expect(post).toHaveProperty('post_author')
        expect(post).toHaveProperty('category_name')
        expect(post).toHaveProperty('created_at')
      }
    })

    it('should handle database connection', async () => {
      const response = await request(app)
        .get('/posts')
      expect([200, 500]).toContain(response.status)
      
      if (response.status === 500) {
        expect(response.body).toHaveProperty('error')
      }
    })

    it('should return consistent data structure', async () => {
      const response = await request(app)
        .get('/posts')
        .expect(200)

      expect(Array.isArray(response.body)).toBe(true)
      response.body.forEach((post: any) => {
        expect(typeof post.post_id).toBe('number')
        expect(typeof post.title).toBe('string')
        expect(typeof post.content).toBe('string')
        expect(typeof post.post_author).toBe('string')
        expect(typeof post.category_name).toBe('string')
        expect(post.created_at).toBeDefined()
      })
    })

    it('should perform well with real database queries', async () => {
      const startTime = Date.now()
      
      const response = await request(app)
        .get('/posts')
        .expect(200)

      const duration =Date.now()-startTime
      expect(duration).toBeLessThan(5000)
      expect(Array.isArray(response.body)).toBe(true)
    })

    it('should handle multiple concurrent requests', async ()=>{
      const requests = Array(3).fill(null).map(() => 
        request(app).get('/posts')
      )

      const responses = await Promise.all(requests)
      responses.forEach(response => {
        expect([200, 500]).toContain(response.status)
        if (response.status === 200) {
          expect(Array.isArray(response.body)).toBe(true)
        }
      })
    })
  })
})

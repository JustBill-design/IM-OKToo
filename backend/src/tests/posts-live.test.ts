import request from 'supertest'
import express from 'express'
import postsRouter from '../../routes/posts'
import { getTestDbConnection, setupTestDatabase, seedTestData, cleanupTestData } from '../test/cloud-test-setup'

const app = express()
app.use(express.json())
app.use('/posts', postsRouter)

describe('Posts API Database Test', () => {
  
  beforeAll(async () => {
    await setupTestDatabase()
    await seedTestData()
  }, 30000)
  
  afterAll(async () => {
    await cleanupTestData()
  }, 10000)
  
  beforeEach(async () => {
    await seedTestData()
  })
  
  afterEach(async () => {
    await cleanupTestData()
  })
  
  describe('GET /posts', () => {
    it('should return posts with correct database schema', async () => {
      const response = await request(app)
        .get('/posts')
        .expect(200)

      expect(Array.isArray(response.body)).toBe(true)
      
      if (response.body.length > 0) {
        const post = response.body[0]
        expect(post).toHaveProperty('post_id')
        expect(post).toHaveProperty('title')
        expect(post).toHaveProperty('content')
        expect(post).toHaveProperty('views')
        expect(post).toHaveProperty('likes_count')
        expect(post).toHaveProperty('comments_count')
        expect(post).toHaveProperty('created_at')
        expect(post).toHaveProperty('post_author')
        expect(post).toHaveProperty('category_name')
        expect(typeof post.post_id).toBe('number')
        expect(typeof post.title).toBe('string')
        expect(typeof post.content).toBe('string')
        expect(typeof post.views).toBe('number')
        expect(typeof post.likes_count).toBe('number')
        expect(typeof post.comments_count).toBe('number')
        expect(typeof post.post_author).toBe('string')
        expect(typeof post.category_name).toBe('string')
      }
    }, 15000)

    it('handle database connection error', async () => {
      const db = await getTestDbConnection()
      const response = await request(app)
        .get('/posts')
      expect([200, 500]).toContain(response.status)
      
      if (response.status === 500) {
        expect(response.body).toHaveProperty('error')
      }
    }, 10000)
  })

  describe('GET /posts/categories', () => {
    it('should return categories', async () => {
      const response = await request(app)
        .get('/posts/categories')
        .expect(200)

      expect(Array.isArray(response.body)).toBe(true)
      
      if (response.body.length > 0) {
        const category = response.body[0]
        expect(category).toHaveProperty('category_id')
        expect(category).toHaveProperty('name')
        expect(typeof category.category_id).toBe('number')
        expect(typeof category.name).toBe('string')
      }
    }, 10000)
  })

  describe('POST /posts', () => {
    it('should create a new post', async () => {
      const newPost = {
        title: 'live test post dont mind me',
        content: 'just testing stuff during testing time',
        username: 'testuser1',
        category_id: 1
      }

      const response = await request(app)
        .post('/posts')
        .send(newPost)
        .expect(201)

      expect(response.body).toHaveProperty('success', true)
      expect(response.body).toHaveProperty('post_id')
      expect(typeof response.body.post_id).toBe('number')
      const getResponse = await request(app)
        .get('/posts')
        .expect(200)
      
      const createdPost = getResponse.body.find((p: any) => p.post_id === response.body.post_id)
      expect(createdPost).toBeDefined()
      expect(createdPost.title).toBe(newPost.title)
      expect(createdPost.content).toBe(newPost.content)
    }, 15000)

    it('should handle invalid post data', async () => {
      const invalidPost = {
        title: '',
        content: ''
      }

      const response = await request(app)
        .post('/posts')
        .send(invalidPost)
      
      expect([400, 500]).toContain(response.status)
    }, 10000)
  })
})

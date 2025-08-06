import request from 'supertest'
import express from 'express'
import postsRouter from '../../routes/posts'
import mysql from 'mysql2/promise'
import getConnection from '../db'


jest.mock('../db', () => {
  return jest.fn().mockResolvedValue({
    query: jest.fn(),
  })
})


const mockGetConnection = getConnection as jest.MockedFunction<typeof getConnection>

const app = express()
app.use(express.json())
app.use('/posts', postsRouter)

describe('Posts API for the database', () => {
  let mockDb: any

  beforeEach(() => {
    mockDb = {
      query: jest.fn(),
      // No more end() method since we use pools
    }
    mockGetConnection.mockResolvedValue(mockDb)
  })
  
  afterEach(() => {
    jest.clearAllMocks()
  })
  
  describe('GET /posts', () => {
    it('post with matching database schema', async () => {
      const mockDbResponse = [
        [
          {
            post_id: 1,
            title: 'Feeling cute today might delete later',
            content: 'loll',
            views: 999,
            likes_count: 99,
            comments_count: 2,
            created_at: '2025-07-19T03:22:47.000Z',
            post_author: 'yeye', // changed from username to post_author
            category_name: 'General', // changed from name to category_name
          },
          {
            post_id: 2,
            title: 'ur mom',
            content: 'wow!',
            views: 250,
            likes_count: 30,
            comments_count: 1,
            created_at: '2025-07-19T03:22:47.000Z',
            post_author: 'dora', 
            category_name: 'Anxiety', 
          }
        ],
        []
      ]

      mockDb.query.mockResolvedValue(mockDbResponse)

      const response = await request(app)
        .get('/posts')
        .expect(200)

      expect(response.body).toHaveLength(2)
      expect(response.body[0]).toMatchObject({
        post_id: expect.any(Number),
        title: expect.any(String),
        content: expect.any(String),
        views: expect.any(Number),
        likes_count: expect.any(Number),
        comments_count: expect.any(Number),
        created_at: expect.any(String),
        post_author: expect.any(String), 
        category_name: expect.any(String)
      })
      // remove the .end() expectation since we don't call it anymore
    })

    it('handle database connection', async () => {
      mockDb.query.mockRejectedValue(new Error('Connection failed'))
      
      const response = await request(app)
        .get('/posts')
        .expect(500)

      expect(response.body).toEqual({ error: 'Database Error' })
    })

    it('shld handle missing table errors', async () => {
      mockDb.query.mockRejectedValue(new Error("Table 'Posts' dont exist"))

      const response = await request(app)
        .get('/posts')
        .expect(500)

      expect(response.body.error).toBe('Database Error')
    })

    it('empty when no posts exist', async () => {
      mockDb.query.mockResolvedValue([[], []])
      const response = await request(app)
        .get('/posts')
        .expect(200)

      expect(response.body).toEqual([])
      expect(Array.isArray(response.body)).toBe(true)
    })
  })

  describe('Database schema validation',() => {
    it('shld have proper join statement', async () => {
      const expectedQuery = expect.stringContaining('Posts POST')
      mockDb.query.mockResolvedValue([[], []])

      await request(app).get('/posts')

      expect(mockDb.query).toHaveBeenCalledWith(expectedQuery)
    })
  })
})

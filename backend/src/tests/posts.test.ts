import request from 'supertest'
import express from 'express'
import postsRouter from '../../routes/posts'
import mysql from 'mysql2/promise'

jest.mock('mysql2/promise')
const mockMysql = mysql as jest.Mocked<typeof mysql>
const app = express()
app.use(express.json())
app.use('/posts', postsRouter)
describe('Posts API for the database', () => {
  let mockConnection: any

  beforeEach(() => {
    mockConnection = {
      query: jest.fn(),
      end: jest.fn()
    }
    mockMysql.createConnection = jest.fn().mockResolvedValue(mockConnection)
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
            username: 'yeye',
            name: 'General',
            comment_id: 2
          },
          {
            post_id: 2,
            title: 'ur mom',
            content: 'wow!',
            views: 250,
            likes_count: 30,
            comments_count: 1,
            created_at: '2025-07-19T03:22:47.000Z',
            username: 'dora',
            name: 'Anxiety',
            comment_id: 3
          }
        ],
        []
      ]

      mockConnection.query.mockResolvedValue(mockDbResponse)

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
        username: expect.any(String),
        name: expect.any(String)
      })
      expect(mockConnection.end).toHaveBeenCalledTimes(1)
    })

    it('handle database connection', async () => {
      mockConnection.query.mockRejectedValue(new Error('Connection failed'))
      
      const response = await request(app)
        .get('/posts')
        .expect(500)

      expect(response.body).toEqual({ error: 'Database Error' })
    })

    it('shld handle missing table errors', async () => {
      mockConnection.query.mockRejectedValue(new Error("Table 'Posts' dont exist"))

      const response = await request(app)
        .get('/posts')
        .expect(500)

      expect(response.body.error).toBe('Database Error')
    })

    it('empty when no posts exist', async () => {
      mockConnection.query.mockResolvedValue([[], []])
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
      mockConnection.query.mockResolvedValue([[], []])

      await request(app).get('/posts')

      expect(mockConnection.query).toHaveBeenCalledWith(expectedQuery)
    })
  })
})

import request from 'supertest'
import express from 'express'
import postsRouter from '../../routes/posts'
import mysql from 'mysql2/promise'

jest.mock('mysql2/promise')
const mockMysql = mysql as jest.Mocked<typeof mysql>
const app = express()
app.use(express.json())
app.use('/posts', postsRouter)
describe('Posts API for the database',()=> {
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
    it('shld match the database schema', async()=> {
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
        post_id: 1,
        title: 'Feeling cute today might delete later',
        views: 999,
        likes_count: 99
      })
    })

    it('database connection errorz', async () => {
      mockConnection.query.mockRejectedValue(new Error('Connection failed'))
      const response = await request(app)
        .get('/posts')
        .expect(500)

      expect(response.body).toEqual({ error: 'Database Error' })
    })

    it('shld handle missing post table', async () => {
      mockConnection.query.mockRejectedValue(new Error("table no exist "))

      const response = await request(app)
        .get('/posts')
        .expect(500)

      expect(response.body.error).toBe('Database Error')
    })
  })

  describe('Database schema validation', () => {
    it('should work with correct table names', async () => {
      
      const expectedQuery = expect.stringContaining('Posts POST')
      mockConnection.query.mockResolvedValue([[], []])

      await request(app).get('/posts')

      expect(mockConnection.query).toHaveBeenCalledWith(expectedQuery)
    })
  })
})

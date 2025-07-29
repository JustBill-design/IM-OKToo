import request from 'supertest'
import express from 'express'
import cors from 'cors'

describe('Middleware Testing',()=> {
  let app: express.Application
  beforeEach(() => {
    app = express()
  })

  describe('CORS Middleware', () =>{
    it('allow request from frontend origin', async () => {
      app.use(cors({
        origin: 'http://localhost:5173',
        credentials: true
      }))
      app.get('/test', (req, res) => res.json({ message: 'ok' }))
      const response = await request(app)
        .get('/test')
        .set('Origin', 'http://localhost:5173')
        .expect(200)
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173')
      expect(response.headers['access-control-allow-credentials']).toBe('true')})})
  describe('JSON', () => {
    it('parses JSON request bodies correctly', async () => {
      app.use(express.json())
      app.post('/test', (req, res) =>{
        res.json({received: req.body})
      })
      const testData = {username: 'testuser', message: 'testing' }
      const response =await request(app)
        .post('/test')
        .send(testData)
        .expect(200)
      expect(response.body.received).toEqual(testData)
    })
    it('handles bad JSON', async () => {
      app.use(express.json())
      app.post('/test', (req, res) => {
        res.json({ received: req.body })
      })
      await request(app)
        .post('/test')
        .set('Content-Type','application/json')
        .send('{ invalid json }')
        .expect(400)
    })
  })
  describe('Routes', () => {
    it('mounts routes at correct paths',async()=> {
      const postsRouter = express.Router()
      postsRouter.get('/', (req, res) =>res.json({ message:'posts endpoint'}))
      app.use('/posts', postsRouter)
      const response = await request(app)
        .get('/posts')
        .expect(200)
      expect(response.body.message).toBe('posts endpoint')
    })
  })
  describe('full middleware', () => {
    it('test full middleware integration', async () =>{
      app.use(cors({
        origin: 'http://localhost:5173',
        credentials:true
      }))
      app.use(express.json())
      const postsRouter = express.Router()
      postsRouter.get('/', (req, res) => {
        res.json([{ id: 1, title:'Test post',content:'Test content' }])
      })
      app.use('/posts', postsRouter)
      const response = await request(app)
        .get('/posts')
        .set('Origin', 'http://localhost:5173')
        .expect(200)
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173')
      expect(response.body).toHaveLength(1)
      expect(response.body[0].title).toBe('Test post')})})}
)

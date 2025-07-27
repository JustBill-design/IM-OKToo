import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import postsRoute from '../routes/posts'
import claudeRoute from '../routes/claude'
import tasksRouter from '../routes/tasks'

dotenv.config()

const app = express()
app.use(cors(
    {
        origin: 'http://localhost:5173',
        credentials: true
    }
))
app.use(express.json())

app.use('/posts', postsRoute)
app.use('/claude', claudeRoute)
app.use('/api/tasks', tasksRouter)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
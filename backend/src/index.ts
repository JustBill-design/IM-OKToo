import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import postsRoute from '../routes/posts'
import claudeRoute from '../routes/claude'
import tasksRouter from '../routes/tasks'
import calendarRoute from '../routes/calendar'
import loginRoute from '../routes/login'
import scraperRoute from '../routes/scraper'
//import path from 'path'
//import { fileURLToPath } from 'url';

dotenv.config()

const app = express()

app.use(cors(
    {
        origin: 'http://localhost:5173',
        credentials: true
    }
))

//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);
//const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');

//app.use(express.static(frontendDistPath));
app.use(express.json())

//app.get('*', (req, res) => {
//  res.sendFile(path.join(frontendDistPath, 'index.html'));
//});

//API mountings
app.use('/posts', postsRoute)
app.use('/claude', claudeRoute)
app.use('/api/tasks', tasksRouter)
app.use('/calendar', calendarRoute)
app.use('/', loginRoute)
app.use('/api/scrape-titles', scraperRoute)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

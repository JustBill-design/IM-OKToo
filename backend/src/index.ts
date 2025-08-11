import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import postsRoute from '../routes/posts'
import loginRoute from '../routes/login'
import claudeRoute from '../routes/claude'
import tasksRouter from '../routes/tasks'
import calendarRoute from '../routes/calendar'
import scraperRoute from '../routes/scraper'
import settingsRoute from '../routes/settings'
import mysql from 'mysql2/promise';
import db from './db'
// import path from 'path'
// import { fileURLToPath } from 'url';

dotenv.config()

const app = express()
app.use(cors(
    {
        origin: 'http://localhost:5173',
        credentials: true
    }
))

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const frontendDistPath = path.resolve(__dirname, '../frontend/dist');

// app.use(express.static(frontendDistPath));
app.use(express.json())

//API mountings
app.use('/posts', postsRoute)
app.use('/claude', claudeRoute)
app.use('/api/tasks', tasksRouter)
app.use('/calendar', calendarRoute)
app.use('/api/scrape-titles', scraperRoute)
app.use('/settings', settingsRoute)
app.use('/', loginRoute)

let pool: mysql.Pool | null = null;

(async () => {
  if (!pool) pool = await db();
})();

// app.get('*', (req, res) => {
//   res.sendFile(path.join(frontendDistPath, 'index.html'));
// });

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

process.on('SIGINT', async () => {
  if (pool) {
    await pool.end();
    console.log('Database pool closed');
  }
  process.exit();
});
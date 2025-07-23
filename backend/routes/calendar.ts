import express from 'express'
import { connectWithConnector } from '../src/db';
import { format } from 'date-fns'

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const pool = await connectWithConnector({});
        // Run a lightweight test query
        const [rs] = await pool.query('SELECT 1 AS test');
        console.log('Connection successful! Test result:', rs);
        // Optional: If this is a one-time script, close the pool
        await pool.end();
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database Error' })
    }
})

router.post('/add', async (req, res) => {
    const data = req.body;
    let columns = ['title', 'category', 'start', 'end', 'elderly', 'caretaker'];

    const startTimes = data.startTime.split(":");
    const endTimes = data.endTime.split(":");

    const start = new Date(data.startDate.year, data.startDate.month, data.startDate.day, parseInt(startTimes[0]), parseInt(startTimes[1]), 0);
    const formattedStart = format(start, 'yyyy-MM-dd HH:mm:ss');

    const end = new Date(data.endDate.year, data.endDate.month, data.endDate.day, parseInt(endTimes[0]), parseInt(endTimes[1]), 0);
    const formattedEnd = format(end, 'yyyy-MM-dd HH:mm:ss');

    let values = [data.title, data.category, formattedStart, formattedEnd, data.elderly, data.caretaker];

    // Still need to perform validation that end is > start
    if (data.location && data.location.length > 0) {
        columns.push('location');
        values.push(data.location);
    }

    if (data.description && data.location.length > 0) {
        columns.push('description');
        values.push(data.description);    
    }

    const query = `INSERT INTO Events ( ${columns.join(',')} ) VALUES ( ${values.join(',')} );`;
    console.log(query);
    res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.send('Event created!');
})

export default router
import express from 'express'
import { connectWithConnector } from '../src/db';
import { format } from 'date-fns'
import {google} from 'googleapis'

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.SECRET_ID,
  process.env.REDIRECT
);

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

router.get('/testing',(req,res) => {
  console.log("working");
})

router.post('/add', async (req, res) => {
    const data = req.body;
    let columns = ['title', 'category', 'start', 'end', 'caretaker'];

    const startTimes = data.startTime.split(":");
    const endTimes = data.endTime.split(":");

    const start = new Date(data.startDate.year, data.startDate.month, data.startDate.day, parseInt(startTimes[0]), parseInt(startTimes[1]), 0);
    const formattedStart = format(start, 'yyyy-MM-dd HH:mm:ss');

    const end = new Date(data.endDate.year, data.endDate.month, data.endDate.day, parseInt(endTimes[0]), parseInt(endTimes[1]), 0);
    const formattedEnd = format(end, 'yyyy-MM-dd HH:mm:ss');

    let values = [data.elderly + ": " + data.title, data.category, formattedStart, formattedEnd, data.caretaker];

    if (end < start) {
        res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
        res.send('Creation of event failed as end date and time is earlier than start date and time');
    } 
    else {
        if (data.guests && data.guests.length > 0) {
            columns.push('guests');
            values.push(data.guests);
        }

        if (data.location && data.location.length > 0) {
            columns.push('location');
            values.push(data.location);
        }

        if (data.description && data.description.length > 0) {
            columns.push('description');
            values.push(data.description);    
        }

        columns.push('recurrence');
        if (data.recurrence && data.recurrence.length > 0) {
            values.push(data.recurrence);
        }
        else
        {
            values.push("Does not repeat")
        }

        const quotedValues = values.map(v => `'${v}'`);

        const query = `INSERT INTO Events ( ${columns.join(',')} ) VALUES ( ${quotedValues.join(',')} );`;
        const pool = await connectWithConnector({});
        // Run a lightweight test query
        const [rs] = await pool.query(query);
        console.log('Connection successful! Test result:', rs);
        await pool.end();
        res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
        res.send('Event created!');
})

// Route to initiate Google OAuth2 flow
router.get('/authgooglecalendar', (req, res) => {
  // Generate the Google authentication URL
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // Request offline access to receive a refresh token
    scope: 'https://www.googleapis.com/auth/calendar.readonly' // Scope for read-only access to the calendar
  });
  // Redirect the user to Google's OAuth 2.0 server
  res.redirect(url);
});

// Route to list all calendars
router.get('/calendars', async (req, res) => {
  try {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const response = await calendar.calendarList.list();
    const calendars = response.data.items ?? [];
    res.json(calendars);
  } catch (err) {
    console.error("Error fetching calendars:", err);
    res.status(500).send("Error fetching calendars");
  }
});


// Route to list events from a specified calendar
router.get('/events', async (req, res) => {
    try {
    if (!req.query.code) {
      res.status(400).send("Missing code");
      return;
    }

    const code = req.query.code as string;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

  } catch (err) {
    console.error("OAuth redirect error:", err);
    res.status(500).send("Authentication failed");
  }

  // Get the calendar ID from the query string, default to 'primary'
  const calendarId = (req.query.calendar as string) || 'primary';
  // Create a Google Calendar API client
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  // List events from the specified calendar
  calendar.events.list({
    calendarId,
    timeMin: (new Date()).toISOString(),
    maxResults: 15,
    singleEvents: true,
    orderBy: 'startTime'
  }, (err, response) => {
    if (err) {
      // Handle error if the API request fails
      console.error('Can\'t fetch events');
      res.send('Error');
      return;
    }
    // Send the list of events as JSON
    const events = response?.data?.items || [];
    res.send(events)
    res.redirect('http://localhost:3001/calendars/testing')
  });
});

export default router;
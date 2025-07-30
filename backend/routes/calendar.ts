import express from 'express'
import { eachMinuteOfInterval, format } from 'date-fns'
import { google , calendar_v3 } from 'googleapis'
import getConnection from '../src/db'

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.SECRET_ID,
  process.env.REDIRECT
);

const router = express.Router();

router.get('/testing',(req,res) => {
  console.log("working");
})

router.get('/all', async (req, res) => {
    const email = req.query.email;
    if (!email){
      return res.status(400).send("Missing email");
    }
    const db = await getConnection();
    const [rs] = await db.query(
      'SELECT * FROM Events WHERE email = ?',
      [email, `%${email}%`] // match if user is the caretaker or invited guest
    );
    await db.end();

    res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.send(JSON.stringify(rs));
})

router.post('/add', async (req, res) => {

    const data = req.body;
    let columns = ['title', 'category', 'start', 'end', 'caretaker','email'];

    const startTimes = data.startTime.split(":");
    const endTimes = data.endTime.split(":");

    const start = new Date(data.startDate.year, data.startDate.month-1, data.startDate.day, parseInt(startTimes[0]), parseInt(startTimes[1]), 0);
    const formattedStart = format(start, 'yyyy-MM-dd HH:mm:ss');

    const end = new Date(data.endDate.year, data.endDate.month-1, data.endDate.day, parseInt(endTimes[0]), parseInt(endTimes[1]), 0);
    const formattedEnd = format(end, 'yyyy-MM-dd HH:mm:ss');

    let values = [data.elderly + ": " + data.title, data.category, formattedStart, formattedEnd, data.caretaker,data.email];

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
            values.push("FREQ=DAILY;COUNT=1")
        }

        const quotedValues = values.map(v => `'${v}'`);

        const query = `INSERT INTO Events ( ${columns.join(',')} ) VALUES ( ${quotedValues.join(',')} );`;
        const db = await getConnection();
        const [rs] = await db.query(query);
        console.log('Connection successful! Test result:', rs);
        await db.end();
        res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
        res.send('Event created!');
    }
});

router.post('/delete', async (req, res) => {

  const data = req.body;
  const db = await getConnection();
  const [rs] = await db.query('DELETE FROM Events WHERE event_id = ?', [data.id]);
  console.log('Connection successful! Test result:', rs);
  await db.end();
  res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.send('Event deleted!');

});

router.post('/modify', async (req, res) => {

  const data = req.body;
  const db = await getConnection();
  const [rs] = await db.query(
    `
    UPDATE Events
    SET start = ?, end = ?
    WHERE event_id = ?;
    `,
  [data.start, data.end, data.id]);
  console.log('Connection successful! Test result:', rs);
  await db.end();
  res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.send('Event modified!');

})

// Route to initiate Google OAuth2 flow
router.get('/authgooglecalendar', (req, res) => {
  // Generate the Google authentication URL
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // Request offline access to receive a refresh token
    scope: 'https://www.googleapis.com/auth/calendar.readonly', // Scope for read-only access to the calendar
    state: req.query.email
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
    const email = req.query.state as string;
    console.log(email)
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const calendarId = (req.query.calendar as string) || 'primary';

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const response = await calendar.events.list({
      calendarId,
      timeMin: (new Date()).toISOString(),
      maxResults: 15,
      singleEvents: true,
      orderBy: 'startTime'
    });

    const events = response.data.items || [];

    // Save fetched events to DB
    await saveEventsToDB(events,email);

    // Optional: send back a response
    res.redirect('http://localhost:5173/calendar');
  } catch (err) {
    console.error("OAuth or Calendar error:", err);
    res.status(500).send("Error fetching or saving events");
  }
});


type GoogleCalendarEvent = calendar_v3.Schema$Event;

const saveEventsToDB = async (events: GoogleCalendarEvent[],email:string) => {
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const db = await getConnection();
  console.log('its saving events')
    await db.query(
      `
      DELETE FROM Events WHERE category = 'Google Sync'
      `
    )
  for (const event of events) {
    const title = event.summary ?? '';
    const start = event.start?.dateTime ?? null;
    const end = event.end?.dateTime ?? null;
    const description = event.description ?? null;
    const guests = event.attendees
      ? event.attendees.map((a) => a.email).join(', ')
      : null;
    const location = event.location ?? null;

    // Default/fallback values
    const category = 'Google Sync';
    const caretaker = 'System';
    const recurrence = event.recurrence?.join(', ') ?? 'FREQ=DAILY;COUNT=1';


    if (!start || !end) continue; // Skip events without start/end

    await db.query(
      `
      INSERT INTO Events (title, category, start, end, caretaker, guests, location, description, recurrence, email)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        title,
        category,
        new Date(start),
        new Date(end),
        caretaker,
        guests,
        location,
        description,
        recurrence,
        email
      ]
    );
  }
};



export default router;
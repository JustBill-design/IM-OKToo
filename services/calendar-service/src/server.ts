import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import calendarRouter from './routes/calendar.js';  // Import your teammate's route

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'calendar-service' });
});

// Use your calendar routes
app.use('/calendar', calendarRouter);

app.listen(PORT, () => {
  console.log(`Calendar service running on port ${PORT}`);
});
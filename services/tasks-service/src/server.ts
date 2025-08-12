import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import tasksRouter from './routes/tasks.js';  

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3006;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'tasks-service' });
});

// Use your tasks routes
app.use('/tasks', tasksRouter);

app.listen(PORT, () => {
  console.log(`Tasks service running on port ${PORT}`);
});
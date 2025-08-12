import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import claudeRouter from './routes/claude.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'claude-service' });
});

// claude route
app.use('/claude', claudeRouter);

app.listen(PORT, () => {
  console.log(`Claude service running on port ${PORT}`);
});
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import scraperRouter from './routes/scraper.js';  

 
globalThis.fetch = fetch as any;

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3007;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'scraper-service' });
});

// Use your scraper routes
app.use('/scraper', scraperRouter);

app.listen(PORT, () => {
  console.log(`Scraper service running on port ${PORT}`);
});
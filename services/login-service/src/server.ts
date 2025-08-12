import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import loginRouter from './routes/login.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'login-service' });
});

// Use your login routes
app.use('/login', loginRouter);

app.listen(PORT, () => {
  console.log(`Login service running on port ${PORT}`);
});
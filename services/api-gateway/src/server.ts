import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
}));

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api-gateway' });
});

console.log('Setting up API Gateway routes...');

// ===========================================
// LOGIN SERVICE ROUTES (Direct mapping)
// ===========================================

app.post('/validate', async (req, res) => {
  try {
    console.log('Routing /validate to login-service');
    const response = await fetch('http://login-service:3004/login/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error routing to login service:', error);
    res.status(500).json({ error: 'Gateway routing error' });
  }
});

app.post('/register', async (req, res) => {
  try {
    console.log('Routing /register to login-service');
    const response = await fetch('http://login-service:3004/login/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error routing to login service:', error);
    res.status(500).json({ error: 'Gateway routing error' });
  }
});

app.post('/check-google-user', async (req, res) => {
  try {
    console.log('Routing /check-google-user to login-service');
    const response = await fetch('http://login-service:3004/login/check-google-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error routing to login service:', error);
    res.status(500).json({ error: 'Gateway routing error' });
  }
});

app.post('/update-last-login', async (req, res) => {
  try {
    console.log('Routing /update-last-login to login-service');
    const response = await fetch('http://login-service:3004/login/update-last-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error routing to login service:', error);
    res.status(500).json({ error: 'Gateway routing error' });
  }
});

// ===========================================
// TASKS SERVICE ROUTES (/api/tasks)
// ===========================================

app.get('/api/tasks', async (req, res) => {
  try {
    console.log('Routing /api/tasks to tasks-service');
    const queryString = new URLSearchParams(req.query as any).toString();
    const url = `http://tasks-service:3006/tasks${queryString ? '?' + queryString : ''}`;
    const response = await fetch(url);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error routing to tasks service:', error);
    res.status(500).json({ error: 'Gateway routing error' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    console.log('Routing POST /api/tasks to tasks-service');
    const response = await fetch('http://tasks-service:3006/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error routing to tasks service:', error);
    res.status(500).json({ error: 'Gateway routing error' });
  }
});

app.patch('/api/tasks/:id', async (req, res) => {
  try {
    console.log(`Routing PATCH /api/tasks/${req.params.id} to tasks-service`);
    const response = await fetch(`http://tasks-service:3006/tasks/${req.params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error routing to tasks service:', error);
    res.status(500).json({ error: 'Gateway routing error' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    console.log(`Routing DELETE /api/tasks/${req.params.id} to tasks-service`);
    const response = await fetch(`http://tasks-service:3006/tasks/${req.params.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error routing to tasks service:', error);
    res.status(500).json({ error: 'Gateway routing error' });
  }
});

// ===========================================
// FORUM/POSTS SERVICE ROUTES
// ===========================================

// Get all posts
app.get('/api/posts', async (req, res) => {
  try {
    console.log('Routing /api/posts to forum-service');
    const queryString = new URLSearchParams(req.query as any).toString();
    const url = `http://forum-service:3003/posts${queryString ? '?' + queryString : ''}`;
    const response = await fetch(url);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error routing to forum service:', error);
    res.status(500).json({ error: 'Gateway routing error' });
  }
});

// Get categories
app.get('/api/posts/categories', async (req, res) => {
  try {
    console.log('Routing /api/posts/categories to forum-service');
    const response = await fetch('http://forum-service:3003/posts/categories');
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error routing to forum service:', error);
    res.status(500).json({ error: 'Gateway routing error' });
  }
});

// Add posts
app.post('/api/posts/addposts', async (req, res) => {
  try {
    console.log('Routing POST /api/posts/addposts to forum-service');
    const response = await fetch('http://forum-service:3003/posts/addposts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error routing to forum service:', error);
    res.status(500).json({ error: 'Gateway routing error' });
  }
});

// Add comments
app.post('/api/posts/addcomments', async (req, res) => {
  try {
    console.log('Routing POST /api/posts/addcomments to forum-service');
    const response = await fetch('http://forum-service:3003/posts/addcomments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error routing to forum service:', error);
    res.status(500).json({ error: 'Gateway routing error' });
  }
});

// Get comments for a post
app.get('/api/posts/:postId/comments', async (req, res) => {
  try {
    console.log(`Routing /api/posts/${req.params.postId}/comments to forum-service`);
    const response = await fetch(`http://forum-service:3003/posts/${req.params.postId}/comments`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error routing to forum service:', error);
    res.status(500).json({ error: 'Gateway routing error' });
  }
});

// Delete comment
app.delete('/api/posts/deletecomment/:commentId', async (req, res) => {
  try {
    console.log(`Routing DELETE /api/posts/deletecomment/${req.params.commentId} to forum-service`);
    const response = await fetch(`http://forum-service:3003/posts/deletecomment/${req.params.commentId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error routing to forum service:', error);
    res.status(500).json({ error: 'Gateway routing error' });
  }
});

// Edit post
app.put('/api/posts/:postId/edit', async (req, res) => {
  try {
    console.log(`Routing PUT /api/posts/${req.params.postId}/edit to forum-service`);
    const response = await fetch(`http://forum-service:3003/posts/${req.params.postId}/edit`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error routing to forum service:', error);
    res.status(500).json({ error: 'Gateway routing error' });
  }
});

// Delete post
app.delete('/api/posts/delete/:postId', async (req, res) => {
  try {
    console.log(`Routing DELETE /api/posts/delete/${req.params.postId} to forum-service`);
    const response = await fetch(`http://forum-service:3003/posts/delete/${req.params.postId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error routing to forum service:', error);
    res.status(500).json({ error: 'Gateway routing error' });
  }
});

// ===========================================
// CALENDAR SERVICE ROUTES
// ===========================================

app.get('/api/calendar/testing', async (req, res) => {
  try {
    console.log('Routing /api/calendar/testing to calendar-service');
    const response = await fetch('http://calendar-service:3005/calendar/testing');
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error routing to calendar service:', error);
    res.status(500).json({ error: 'Gateway routing error' });
  }
});

app.get('/api/calendar/all', async (req, res) => {
  try {
    console.log('Routing /api/calendar/all to calendar-service');
    const queryString = new URLSearchParams(req.query as any).toString();
    const url = `http://calendar-service:3005/calendar/all${queryString ? '?' + queryString : ''}`;
    const response = await fetch(url);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error routing to calendar service:', error);
    res.status(500).json({ error: 'Gateway routing error' });
  }
});

app.post('/api/calendar/add', async (req, res) => {
  try {
    console.log('Routing POST /api/calendar/add to calendar-service');
    const response = await fetch('http://calendar-service:3005/calendar/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error routing to calendar service:', error);
    res.status(500).json({ error: 'Gateway routing error' });
  }
});

app.post('/api/calendar/delete', async (req, res) => {
  try {
    console.log('Routing POST /api/calendar/delete to calendar-service');
    const response = await fetch('http://calendar-service:3005/calendar/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error routing to calendar service:', error);
    res.status(500).json({ error: 'Gateway routing error' });
  }
});

app.post('/api/calendar/modify', async (req, res) => {
  try {
    console.log('Routing POST /api/calendar/modify to calendar-service');
    const response = await fetch('http://calendar-service:3005/calendar/modify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error routing to calendar service:', error);
    res.status(500).json({ error: 'Gateway routing error' });
  }
});

// Google Calendar routes
app.get('/api/calendar/authgooglecalendar', async (req, res) => {
  try {
    console.log('Routing /api/calendar/authgooglecalendar to calendar-service');
    const queryString = new URLSearchParams(req.query as any).toString();
    const url = `http://calendar-service:3005/calendar/authgooglecalendar${queryString ? '?' + queryString : ''}`;
    const response = await fetch(url);
    if (response.redirected) {
      return res.redirect(response.url);
    }
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error routing to calendar service:', error);
    res.status(500).json({ error: 'Gateway routing error' });
  }
});

// ===========================================
// CLAUDE SERVICE ROUTES
// ===========================================

app.post('/api/claude', async (req, res) => {
  try {
    console.log('Routing /api/claude to claude-service');
    const response = await fetch('http://claude-service:3002/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error routing to claude service:', error);
    res.status(500).json({ error: 'Gateway routing error' });
  }
});

// ===========================================
// SCRAPER SERVICE ROUTES
// ===========================================

app.get('/api/scraper', async (req, res) => {
  try {
    console.log('Routing /api/scraper to scraper-service');
    const queryString = new URLSearchParams(req.query as any).toString();
    const url = `http://scraper-service:3007/scraper${queryString ? '?' + queryString : ''}`;
    const response = await fetch(url);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error routing to scraper service:', error);
    res.status(500).json({ error: 'Gateway routing error' });
  }
});

// ===========================================
// BACKWARD COMPATIBILITY ROUTES (without /api prefix)
// ===========================================

app.get('/posts', async (req, res) => {
  try {
    console.log('Routing /posts to forum-service');
    const queryString = new URLSearchParams(req.query as any).toString();
    const url = `http://forum-service:3003/posts${queryString ? '?' + queryString : ''}`;
    const response = await fetch(url);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error routing to forum service:', error);
    res.status(500).json({ error: 'Gateway routing error' });
  }
});

app.post('/claude', async (req, res) => {
  try {
    console.log('Routing /claude to claude-service');
    const response = await fetch('http://claude-service:3002/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error routing to claude service:', error);
    res.status(500).json({ error: 'Gateway routing error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚪 API Gateway running on port ${PORT}`);
  console.log('🔀 Complete routing to all microservices configured!');
});
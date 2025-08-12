import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

import { systemPrompt } from '../prompts/chatbotSystemPrompt'; 

dotenv.config();

const router = express.Router();

router.post('/', async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) {
    return res.status(400).json({ error: 'Missing message in request body' });
  }

  try {
    console.log('Claude API Key:', process.env.CLAUDE_API_KEY);
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.CLAUDE_API_KEY || '',
        'content-type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514', // current latest model
        max_tokens: 1024,
        system: systemPrompt, 
        messages: [
          { role: 'user', content: userMessage }
        ]
      })
    });
    const data: any = await response.json();
    console.log('Claude API response:', data);
    // Claude's response is in data.content[0].text
    res.json({ reply: data.content?.[0]?.text || data.error || 'No response from Claude' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Claude API error' });
  }
});


export default router; 
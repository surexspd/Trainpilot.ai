const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Serve static files (the existing site)
app.use(express.static(path.join(__dirname)));

// Simple chatbot endpoint - replace with real AI/backend later
app.post('/api/chat', (req, res) => {
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: 'No message provided' });

  // Very small rule-based reply for a demo
  const lower = message.toLowerCase();
  let reply = "I'm still learning — here's what I found: ";
  if (lower.includes('hello') || lower.includes('hi')) reply = 'Hello! How can I help you today?';
  else if (lower.includes('pnr')) reply = 'Please provide the PNR number and I will check the status (demo).';
  else if (lower.includes('train') && lower.match(/\d{3,6}/)) reply = 'I found the train number you mentioned, ETA is 7:15 AM (demo).';
  else if (lower.includes('thanks') || lower.includes('thank')) reply = 'You are welcome!';
  else reply = `Echo: ${message}`;

  // Simulate delay for realism
  setTimeout(() => res.json({ reply }), 500);
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

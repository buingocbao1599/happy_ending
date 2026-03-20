const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API: Get wedding data from JSON config
app.get('/api/wedding', (req, res) => {
  const dataPath = path.join(__dirname, '..', 'data', 'wedding.json');
  try {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    // If ?to= query param, add guest name
    const guestName = req.query.to;
    if (guestName) {
      data.guestName = decodeURIComponent(guestName);
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Could not load wedding data' });
  }
});

// API: Get all wishes
const wishesPath = path.join(__dirname, '..', 'data', 'wishes.json');

function readWishes() {
  try {
    return JSON.parse(fs.readFileSync(wishesPath, 'utf-8'));
  } catch {
    return [];
  }
}

function saveWishes(wishes) {
  fs.writeFileSync(wishesPath, JSON.stringify(wishes, null, 2), 'utf-8');
}

app.get('/api/wishes', (req, res) => {
  res.json(readWishes());
});

// API: Post a new wish
app.post('/api/wishes', (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required' });
  }

  const wishes = readWishes();
  const newWish = {
    name: name.trim(),
    message: message.trim(),
    time: new Date().toISOString(),
  };
  wishes.unshift(newWish);
  saveWishes(wishes);

  res.json(newWish);
});

// Serve static React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

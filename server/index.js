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

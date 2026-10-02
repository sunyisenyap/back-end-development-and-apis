const express = require('express');
const app = express();
const port = 3000;

// GET route untuk root path /
app.get('/', (req, res) => {
  res.send("Welcome to Camper Bot's homepage!");
});

// GET route untuk /hobbies
app.get('/hobbies', (req, res) => {
  res.send('I cycle, go boating, and play guitar.');
});

// GET route untuk /skills
app.get('/skills', (req, res) => {
  res.send('JavaScript, Node.js, and Express.js!');
});

// GET route untuk /api/profile
app.get('/api/profile', (req, res) => {
  res.json({
    name: 'Camper Bot',
    hobbies: ['cycling', 'boating', 'guitar'],
    skills: ['JavaScript', 'Node.js', 'Express.js']
  });
});

// Menjalankan server di port 3000
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
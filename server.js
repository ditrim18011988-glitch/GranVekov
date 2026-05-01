const express = require('express');
const app = express();
const path = require('path');

app.use(express.static('public'));

app.get('/music/:name', (req, res) => {
  const file = path.join(__dirname, 'music', req.params.name);
  res.sendFile(file);
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
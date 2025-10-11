const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const file = 'data.json';

app.get('/data.json', (req, res) => {
  const data = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : [];
  res.json(data);
});

app.post('/add', (req, res) => {
  const data = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : [];
  data.push(req.body);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  res.sendStatus(200);
});

app.post('/update', (req, res) => {
  const { index, name, email } = req.body;
  const data = JSON.parse(fs.readFileSync(file));
  data[index] = { name, email };
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  res.sendStatus(200);
});

app.post('/delete', (req, res) => {
  const { index } = req.body;
  const data = JSON.parse(fs.readFileSync(file));
  data.splice(index, 1);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  res.sendStatus(200);
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));

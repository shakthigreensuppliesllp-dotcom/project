const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());


app.use(express.json());
app.use(express.static(__dirname));

const file = 'data.json';

app.get('/data.json', (req, res) => {
  const data = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : [];
  res.json(data);
});

app.post('/add', (req, res) => {
  const newData = {
    billNo: req.body.billNo || '',
    billDate: req.body.billDate || '',
    transporterName: req.body.transporterName || '',
    modeOfTransport: req.body.modeOfTransport || '',
    vehicleNo: req.body.vehicleNo || '',
    ticketNo: req.body.ticketNo || '',
    eWayBillNo: req.body.eWayBillNo || '',
    dateOfSupply: req.body.dateOfSupply || '',
    netQty: req.body.netQty || '',
    total: req.body.total || '',
    totalRounded: req.body.totalRounded || '',
    totalInWords: req.body.totalInWords || '',
    invoiceStatus: req.body.invoiceStatus || ''
  };


  let existingData = [];
  if (fs.existsSync('data.json')) {
    existingData = JSON.parse(fs.readFileSync('data.json'));
  }

  existingData.push(newData);

  fs.writeFileSync('data.json', JSON.stringify(existingData, null, 2));
  res.sendStatus(200);
  console.log(data); // Check what’s coming from /data.json

});


app.post('/update', (req, res) => {
  const index = parseInt(req.body.index); // Ensure it's a number
  const updatedData = {
    billNo: req.body.billNo || '',
    billDate: req.body.billDate || '',
    transporterName: req.body.transporterName || '',
    modeOfTransport: req.body.modeOfTransport || '',
    vehicleNo: req.body.vehicleNo || '',
    ticketNo: req.body.ticketNo || '',
    eWayBillNo: req.body.eWayBillNo || '',
    dateOfSupply: req.body.dateOfSupply || '',
    netQty: req.body.netQty || '',
    total: req.body.total || '',
    totalRounded: req.body.totalRounded || '',
    totalInWords: req.body.totalInWords || '',
    invoiceStatus: req.body.invoiceStatus || ''
  };

  const data = fs.existsSync('data.json') ? JSON.parse(fs.readFileSync('data.json')) : [];

  if (index >= 0 && index < data.length) {
    data[index] = updatedData;
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
    res.sendStatus(200);
  } else {
    res.status(400).send('Invalid index');
  }
});


app.post('/delete', (req, res) => {
  const { index } = req.body;
  const data = JSON.parse(fs.readFileSync(file));
  data.splice(index, 1);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  res.sendStatus(200);
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));

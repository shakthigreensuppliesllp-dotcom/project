const { log } = require('console');
const express = require('express');
const fs = require('fs');
const path = require('path');
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

app.get('/po_data.json', (req, res) => {
  const data = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : [];
  res.json(data);
  console.log("Server Data:", data);
});

app.post('/save-tractor', (req, res) => {
  const newEntry = req.body;
  const filePath = path.join(__dirname, 'tractor_data.json');

  // Read existing data
  fs.readFile(filePath, 'utf8', (err, data) => {
    let existingData = [];

    if (!err && data) {
      try {
        existingData = JSON.parse(data);
        if (!Array.isArray(existingData)) {
          existingData = [existingData]; // Convert single object to array
        }
      } catch (parseErr) {
        console.error('Error parsing JSON:', parseErr);
        return res.status(500).send('Invalid JSON format');
      }
    }

    // Append new entry
    existingData.push(newEntry);

    // Save updated array
    fs.writeFile(filePath, JSON.stringify(existingData, null, 2), err => {
      if (err) {
        console.error('Error saving file:', err);
        return res.status(500).send('Failed to save data');
      }
      res.send('✅ Data saved');
    });
  });
});


app.get('/get-tractor-data', (req, res) => {
  const filePath = path.join(__dirname, 'tractor_data.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).send('Failed to read data');
    }

    try {
      const parsed = JSON.parse(data);
      const result = Array.isArray(parsed) ? parsed : [parsed];
      res.json(result);
    } catch (parseErr) {
      console.error('Error parsing JSON:', parseErr);
      res.status(500).send('Invalid JSON format');
    }
  });
});

app.get('/get-driver/:mobileNo', (req, res) => {
  const filePath = path.join(__dirname, 'tractor_data.json');
  const mobileNo = req.params.mobileNo;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading data');

    try {
      const entries = JSON.parse(data);
      const result = entries.find(entry => entry.mobileNo === mobileNo);
      if (result) {
        res.json(result);
      } else {
        res.status(404).send('Driver not found');
      }
    } catch (err) {
      res.status(500).send('Invalid JSON format');
    }
  });
});

app.put('/update-driver/:mobileNo', (req, res) => {
  const filePath = path.join(__dirname, 'tractor_data.json');
  const mobileNo = req.params.mobileNo;
  const updatedData = req.body;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading data');

    try {
      let entries = JSON.parse(data);
      const index = entries.findIndex(entry => entry.mobileNo === mobileNo);

      if (index === -1) return res.status(404).send('Driver not found');

      entries[index] = { ...entries[index], ...updatedData };

      fs.writeFile(filePath, JSON.stringify(entries, null, 2), err => {
        if (err) return res.status(500).send('Error saving data');
        res.send('Driver data updated');
      });
    } catch (err) {
      res.status(500).send('Invalid JSON format');
    }
  });
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));

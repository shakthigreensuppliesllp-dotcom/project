const express = require('express');
const path = require('path');
const session = require('express-session');
const { google } = require('googleapis');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'shakthi-vehicle-app-2025-secure-session',
  resave: false,
  saveUninitialized: true
}));

const auth = new google.auth.GoogleAuth({
  keyFile: 'google-credentials.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets('v4');
const spreadsheetId = '1xUtT8lPGoVmIdlRGXgBKdYzlSLZlsjxczVpbp-no8z4'; // Replace with actual ID

// Routes
//Index
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views/index.html')));

/* --- Vehicle Section ---*/
//Vehicle View Route
app.get('/view-vehicle', (req, res) => {
  if (!res) return res.redirect('/index');
  res.sendFile(path.join(__dirname, 'views/view-vehicle.html'));
});

// Get Method for Vehicle View Data
app.get('/get-vehicle', async (req, res) => {
  try {
    const client = await auth.getClient();
    const response = await sheets.spreadsheets.values.get({
      auth: client,
      spreadsheetId,
      range: 'Tractors!A2:I' // Adjust if your sheet/tab name is different
    });

    res.json(response.data.values || []);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Failed to fetch data');
  }
});

//Vehicle Form Route
app.get('/vehicle-form', (req, res) => {
  if (!res) return res.redirect('/index');
  res.sendFile(path.join(__dirname, 'views/vehicle-form.html'));
});

// Save Method for Vehicle Form Data to Google Sheet
app.post('/save-vehicle', async (req, res) => {
  console.log('Incoming data:', req.body);

  try {
    const client = await auth.getClient();
    const existing = await sheets.spreadsheets.values.get({
      auth: client,
      spreadsheetId,
      range: 'Tractors!A2:A'
    });

    const serial = (existing.data.values?.length || 0) + 1;
    const { ownerName, mobileNo, address, vDate, vRent, vVehicleNo, vModel, vRemarks } = req.body;
    const values = [[serial, ownerName, mobileNo, address, vDate, vRent, vVehicleNo, vModel, vRemarks]];

    await sheets.spreadsheets.values.append({
      auth: client,
      spreadsheetId,
      range: 'Tractors!A2',
      valueInputOption: 'USER_ENTERED',
      resource: { values }
    });

    res.sendStatus(200);
  } catch (error) {
    console.error('Google Sheets error:', error);
    res.status(500).send('Failed to save data');
  }
});

/* --- Emplyee Section ---*/

//Employee View Route
app.get('/view-employee', (req, res) => {
  if (!res) return res.redirect('/index');
  res.sendFile(path.join(__dirname, 'views/view-employee.html'));
});

//Get Method for Emplyee View Data
app.get('/get-employee', async (req, res) => {
  try {
    const client = await auth.getClient();
    const response = await sheets.spreadsheets.values.get({
      auth: client,
      spreadsheetId,
      range: 'Employees!A2:G' // Adjust if your tab name or columns differ
    });

    res.json(response.data.values || []);
  } catch (error) {
    console.error('Error fetching employee data:', error.message);
    res.status(500).send('Failed to fetch employee data');
  }
});

//Emplyee Form Route
app.get('/employee-form', (req, res) => {
  if (!res) return res.redirect('/index');
  res.sendFile(path.join(__dirname, 'views/employee-form.html'));
});

//Save Method for Employee Form Data to Google Sheet
app.post('/save-employee', async (req, res) => {
  try {
    const client = await auth.getClient();
    const existing = await sheets.spreadsheets.values.get({
      auth: client,
      spreadsheetId,
      range: 'Employees!A2:A' // ✅ Sheet tab should be named "Employees"
    });

    const serial = (existing.data.values?.length || 0) + 1;
    const { name, role, mobile, joiningDate, salary, remarks } = req.body;
    const values = [[serial, name, role, mobile, joiningDate, salary, remarks]];

    await sheets.spreadsheets.values.append({
      auth: client,
      spreadsheetId,
      range: 'Employees!A2',
      valueInputOption: 'USER_ENTERED',
      resource: { values }
    });

    res.sendStatus(200);
  } catch (error) {
    console.error('Google Sheets error:', error.message);
    req.session.errorMsg = 'Failed to save employee. Check Google Sheets setup.';
    res.redirect('/index');
  }
});

/* --- Create Invoice Section ---*/

//Invoice Create Route
app.get('/nelloreCowDungInvoice', (req, res) => {
  if (!res) return res.redirect('/index');
  res.sendFile(path.join(__dirname, 'views/invoice/nelloreCowDungInvoice.html'));
});


/* --- Invoice View Section ---*/

//Invoice Create Route
app.get('/nelloreCowDungInvoiceData', (req, res) => {
  if (!res) return res.redirect('/index');
  res.sendFile(path.join(__dirname, 'views/invoice/nelloreCowDungInvoiceData.html'));
});

//Get Method for Nellore Invoice View Data
app.get('/get-nellore-invoice-data', async (req, res) => {
  try {
    const client = await auth.getClient();
    const response = await sheets.spreadsheets.values.get({
      auth: client,
      spreadsheetId,
      range: 'Nellore_Invoice_Data!A2:R'
    });

    res.json(response.data.values || []);
  } catch (error) {
    console.error('Error fetching invoice data:', error.message);
    res.status(500).send('Failed to fetch employee data');
  }
});


//ASN Create Route
app.get('/nelloreCowDungASNData', (req, res) => {
  if (!res) return res.redirect('/index');
  res.sendFile(path.join(__dirname, 'views/invoice/nelloreCowDungASNData.html'));
});


const spreadsheetId2 = '1gw0bmyr0fLyKIsC6ZqMLUJNaUXJNO7P-cAhtMD82Igw';

app.get('/get-nellore-asn-data', async (req, res) => {
  try {
    const client = await auth.getClient();
    const response = await sheets.spreadsheets.values.get({
      auth: client,
      spreadsheetId: spreadsheetId2,
      range: 'Nellore_Data!A2:AA'
    });

    res.json(response.data.values || []);
  } catch (error) {
    console.error('Error fetching ASN data:', error); // ✅ Full error log
    res.status(500).send('Failed to fetch ASN data');
  }
});

// app.get('/get-nellore-asn-data', async (req, res) => {
//   try {
//     res.json([["Test", "Row", "Works"]]);
//   } catch (error) {
//     console.error('Error fetching invoice data:', error);
//     res.status(500).send('Failed to fetch ASN data');
//   }
// });


app.listen(3000, () => console.log('🚀 Server running at http://localhost:3000'));

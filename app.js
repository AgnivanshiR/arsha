const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 5500;
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('bitit.db');

app.use(cors());

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Uploads will be stored in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({ storage });

// Serve static files (if needed)
app.use(express.static('public'));

// Define a route for the form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'form.html'));
});

// Handle form submission
app.post('/submit', upload.fields([
  { name: 'identityProof', maxCount: 1 },
  { name: 'addressProofs[]', maxCount: 2 }, // Note the square brackets
  { name: 'resume', maxCount: 1 },
]), (req, res) => {
  // Process form data and uploaded files here
  // You can access form fields using req.body and uploaded files using req.files

  // Example: Logging form data
  console.log(req.body);

  // Example: Logging uploaded files
  console.log(req.files);

  // Redirect or respond as needed
  res.send('Form submitted successfully.');
});

// Create tables and schema as needed
db.serialize(function() {
  // Create a table for membership applications if it doesn't exist
  db.run("CREATE TABLE IF NOT EXISTS applications (id INTEGER PRIMARY KEY AUTOINCREMENT, fullName TEXT, gender TEXT, mobile TEXT, email TEXT, state TEXT, address TEXT, itProfessional TEXT, experience INTEGER, primaryCompetency TEXT, secondaryCompetency TEXT, competencyReason TEXT, linkedin TEXT, hoursPerWeek INTEGER, declaration TEXT, consent TEXT)");

  // Additional tables and schema can be defined here if needed
});

// Close the database connection when done
db.close();

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

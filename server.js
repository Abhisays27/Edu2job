// server.js
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('./firebaseConfig');
const axios = require('axios'); // <-- IMPORT AXIOS

const app = express();
const PORT = 3000;
const FLASK_API_URL = 'https://edu2job-python-apii.onrender.com/predict'; // Python API

// ---- Middleware ----
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ---- Config ----
const JWT_SECRET = 'your-super-secret-key-12345';

// --- JWT Verification Middleware ---
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'A token is required for authentication' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// ---- API Endpoints ----

// REGISTRATION Endpoint (Working)
app.post('/register', async (req, res) => {
  try {
    const { name, email, password, college, gender, degree } = req.body;
    if (!name || !email || !password || !college || !gender || !degree) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const userQuery = await db.collection('users').where('email', '==', email).get();
    if (!userQuery.empty) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUserRef = await db.collection('users').add({
      name, email, hashedPassword, college, gender, degree
    });
    res.status(201).json({ message: 'User registered successfully', userId: newUserRef.id });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// LOGIN Endpoint (Working)
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const userQuery = await db.collection('users').where('email', '==', email).get();
    if (userQuery.empty) {
      return res.status(404).json({ message: 'Invalid credentials' });
    }
    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();
    const isPasswordValid = await bcrypt.compare(password, userData.hashedPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { userId: userDoc.id, name: userData.name, email: userData.email },
      JWT_SECRET,
      { expiresIn: '1h' } 
    );
    res.status(200).json({ message: 'Login successful', token, name: userData.name });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});


// --- NEW PREDICTION ENDPOINT ---
app.post('/predict', verifyToken, async (req, res) => {
    const formData = req.body;
    console.log('Node.js: Received prediction request:', formData);

    try {
        // Forward this data to our Python/Flask API
        const flaskResponse = await axios.post(FLASK_API_URL, formData, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000 // <-- ADD THIS LINE (30,000 milliseconds = 30 seconds)
      });
        
        console.log('Node.js: Prediction from Flask:', flaskResponse.data);
        res.status(200).json(flaskResponse.data);
        
    } catch (error) {
        console.error('Node.js: Error calling Flask API:', error.message || error);
        if (error.response) {
            res.status(500).json({ message: 'Error from prediction service', details: error.response.data });
        } else {
            res.status(500).json({ message: 'Prediction service is unreachable. Is the Python server running?' });
        }
    }
});


// ---- Server Start ----
app.listen(PORT, () => {
  console.log(`Node.js server running on http://localhost:${PORT}`);
  console.log(`Make sure Flask API is running on ${FLASK_API_URL}`);
});
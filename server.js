// server.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('./firebaseConfig'); // Import Firestore db

const app = express();
const PORT = 3000;

// ---- Middleware ----
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON request bodies
app.use(express.static('public')); // Serve static files from 'public' folder

// ---- Config ----
// IMPORTANT: Use a strong, random string in a real app (e.g., from a .env file)
const JWT_SECRET = 'your-super-secret-key-12345';

// ---- API Endpoints ----

/**
 * REGISTRATION Endpoint
 * Saves a new user to Firestore with a hashed password.
 */
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const userQuery = await db.collection('users').where('email', '==', email).get();
    if (!userQuery.empty) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Add new user to Firestore
    const newUserRef = await db.collection('users').add({
      name,
      email,
      hashedPassword
    });

    res.status(201).json({ message: 'User registered successfully', userId: newUserRef.id });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

/**
 * LOGIN Endpoint
 * Validates credentials and returns a JWT.
 */
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const userQuery = await db.collection('users').where('email', '==', email).get();
    if (userQuery.empty) {
      return res.status(404).json({ message: 'Invalid credentials' });
    }

    // Get user data
    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();

    // Check password
    const isPasswordValid = await bcrypt.compare(password, userData.hashedPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT
    const token = jwt.sign(
      { userId: userDoc.id, name: userData.name, email: userData.email },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Send token and user name to client
    res.status(200).json({ message: 'Login successful', token, name: userData.name });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

/**
 * JWT Verification Middleware
 * This function will be used to protect routes.
 */
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <TOKEN>"

  if (!token) {
    return res.status(403).json({ message: 'A token is required for authentication' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Add decoded user info (userId, name, email) to request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

/**
 * PROTECTED Dashboard Data Endpoint
 * Only accessible with a valid JWT.
 */
app.get('/api/dashboard', verifyToken, (req, res) => {
  // req.user was added by the verifyToken middleware
  // You can now trust req.user contains the user's data from the token
  
  // Send back dummy data for the dashboard
  const jobData = [
    { role: 'Data Scientist', company: 'Infosys', skills: 'Python, ML, SQL' },
    { role: 'Full Stack Developer', company: 'TCS', skills: 'React, Node.js, Mongo' },
    { role: 'Cloud Engineer', company: 'Wipro', skills: 'AWS, Azure, Docker' }
  ];

  const chartData = {
    labels: ['B.Tech CSE', 'B.Tech ECE', 'MBA', 'M.Tech AI'],
    counts: [120, 75, 50, 45]
  };

  res.status(200).json({
    message: `Welcome, ${req.user.name}!`,
    jobs: jobData,
    chart: chartData
  });
});

// ---- Server Start ----
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
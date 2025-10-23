// firebaseConfig.js
const admin = require('firebase-admin');

// IMPORTANT: Download this file from your Firebase project settings
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Initialize Firestore
const db = admin.firestore();

module.exports = { admin, db };
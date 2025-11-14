const admin = require('firebase-admin');

let serviceAccount;

// This will read the secret key from Render's environment
if (process.env.FIREBASE_KEY) {
  serviceAccount = JSON.parse(process.env.FIREBASE_KEY);
  console.log("Firebase: Authenticating with Environment Variable.");
} else {
  // Fallback for your local Mac
  console.log("Firebase: No key found. Using local serviceAccountKey.json file.");
  serviceAccount = require('./serviceAccountKey.json');
}

// Prevent re-initializing the app
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();
module.exports = { admin, db };
require('dotenv').config();
const express = require("express");
// const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
// const cors = require("cors");
// app.use(cors());

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());



// const express = require("express");
const admin = require("firebase-admin");
// const bodyParser = require("body-parser");
require("dotenv").config(); // For environment variables

// Initialize Firebase Admin SDK
// const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});
// const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// API to send notification
app.post("/send-notification", async (req, res) => {
  const { token, title, body } = req.body;

  if (!token) {
    return res.status(400).json({ error: "FCM token is required" });
  }

  const message = {
    notification: {
      title: title || "Default Title",
      body: body || "Default Body",
    },
    token: token,
  };

  try {
    const response = await admin.messaging().send(message);
    res.status(200).json({ success: true, messageId: response });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
// app.listen(PORT, () => {
  // console.log(`Server running on port ${PORT}`);
// });









// Create a record
app.get('/', (req, res) => {
  res.send('fffKKMHello');
});



// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

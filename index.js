const express = require("express");
const mysql = require("mysql2");
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
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
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









// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "admin", // Change as per your setup
    database: "test"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed: ", err);
    } else {
        console.log("Connected to MySQL database");
    }
});

// Create a record
app.get('/', (req, res) => {
  res.send('fffKKMHello');
});


app.post("/items", (req, res) => {
    const { name, description } = req.body;
    const query = "INSERT INTO items (name, description) VALUES (?, ?)";
    db.query(query, [name, description], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send({ id: result.insertId, name, description });
        }
    });
});

// Read all records
app.get("/items", (req, res) => {
    db.query("SELECT * FROM items", (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(results);
        }
    });
});

// Read a single record
app.get("/items/:id", (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM items WHERE id = ?", [id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else if (result.length === 0) {
            res.status(404).send({ message: "Item not found" });
        } else {
            res.send(result[0]);
        }
    });
});

// Update a record
app.put("/items/:id", (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const query = "UPDATE items SET name = ?, description = ? WHERE id = ?";
    db.query(query, [name, description, id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send({ message: "Item updated successfully" });
        }
    });
});

// Delete a record
app.delete("/items/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM items WHERE id = ?", [id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send({ message: "Item deleted successfully" });
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

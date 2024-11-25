require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const connection = require('./db'); // Ensure this is the correct path to your database config
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
// Database configuration
connection(); // Ensure `connection` is a function in `db.js`

// Middleware
app.use(express.json());
app.use(cors()); // Added missing parentheses

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
// Port configuration
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}`));

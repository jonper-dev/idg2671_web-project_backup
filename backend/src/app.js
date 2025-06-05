const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
const dbConnection = require('./dbConnection');
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(cors());

// Load environment variables from .env file
dotenv.config();

// db connection
dbConnection();

// for debugging
app.get("/", (req, res) => {
    res.send("Server is running!");
});

// Routes
const routes = ['artefactRoutes', 'studyRoutes', 'invitationRoutes', 'participantRoutes'];
routes.forEach(route => {
  app.use('/api', require(`./routes/${route}`));
});
app.use('/api/responses', require('./routes/responseRoutes'));

// Connect upload route
app.use('/api/upload', require('./routes/uploadRoutes'));

// Register/login
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

app.get('/api/me', require('./middleware/authMiddleware'), (req, res) => {
  res.json({ user: req.user });
});

// Serving the frontend build files
app.use(express.static(path.join(__dirname, 'frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;

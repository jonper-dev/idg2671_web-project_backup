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

// Handling file uploads (e.g. POST with multipart/form-data).
app.use('/api/upload', require('./routes/uploadRoutes'));

// Serving uploaded files as static assets.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'production') {
  // Serving frontend build files (for production).
  app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

  // Fallback for SPA (only for non-API, non-static requests).
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
  });
}

// Register/login
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

app.get('/api/me', require('./middleware/authMiddleware'), (req, res) => {
  res.json({ user: req.user });
});

// Error handler for missing files.
app.use((err, req, res, next) => {
  if (err.code === 'ENOENT') {
    return res.status(404).json({ message: 'File not found.' });
  }
  next(err);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;

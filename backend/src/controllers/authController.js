const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Researcher = require('../models/researcher'); // Getting the Researcher-model.
const JWT_SECRET = process.env.JWT_SECRET || 'yourSecretKey';

// Register a new researcher (authenticated user).
exports.registerResearcher = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exists = await Researcher.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered.' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await Researcher.create({ name, email, passwordHash });

    // Optional: auto-login after register
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: '1d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours (1 day)
    });

    res.status(201).json({ message: 'Registration successful.' });
  } catch (err) {
    console.error(err); // Client-side logging.
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Login and send JWT in cookie
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Researcher.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Saving the passwordHash in the database is a security risk, so we use bcrypt to compare the password.
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generating JWT token, which is used for authentication.
    // The token contains the user's ID and email, and is signed with a secret key.
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours (1 day)
    });

    res.json({ message: 'Login successful.' });
  } catch (err) {
    console.error(err); // Client-side logging.
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Logout current user.
exports.logoutUser = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  });
  res.json({ message: 'Logged out successfully' });
};

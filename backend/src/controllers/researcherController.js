const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Researcher = require('../models/researcher');

const JWT_SECRET = process.env.JWT_SECRET || 'yourSecretKey';

const { getById, getModel, deleteModel } = require('../utils/helpers/controllerHelpers'); 
const getResearchers = (req, res) => getModel(Researcher, res, req, 'Researcher'); 
const getResearcherById = (req, res) => getById(Researcher, res, req, 'Researcher'); 
const deleteResearcher = (req, res) => deleteModel(Researcher, req, res, 'Researcher');

const updateResearcher = async(req, res) => {
  try {
    const {    
        name,
        email,
        passwordHash,
        role
     } = req.body; 

    const updatedResearcher = await Researcher.findByIdAndUpdate(
      req.params.id,
      { name, email,  passwordHash, role }, 
      { new: true, runValidators: true }
    );

    if (!updatedResearcher) {
      return res.status(404).json({ message: 'Researcher not found' }); 
    }
    res.status(200).json(updatedResearcher); 
  } catch (error) {
    res.status(500).json({ error: `Error updating researcher: ${error.message}` }); 
  }
};

// Register a new researcher (authenticated user).
const registerResearcher = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existing = await Researcher.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newResearcher = new Researcher({ name, email, passwordHash });

    await newResearcher.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newResearcher._id, email: newResearcher.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

module.exports = {
  registerResearcher,
  getResearcherById,
  getResearchers,
  deleteResearcher,
  updateResearcher
};

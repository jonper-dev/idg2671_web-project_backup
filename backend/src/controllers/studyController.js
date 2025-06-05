const Study = require('../models/study');
const { getById, getModel, deleteModel } = require('../utils/helpers/controllerHelpers');

/**
 * @desc Fetch all studies
 * @route GET /api/studies
 */
const getStudies = (req, res) => getModel(Study, req, res, 'Study');

/**
 * @desc Fetch a single study by ID
 * @route GET /api/studies/:id
 */
const getStudyById = (req, res) => getById(Study, req, res, 'Study');

/**
 * @desc Create a new study
 * @route POST /api/studies
 */
const createStudy = async (req, res) => {
  try {
    const { researcher, title, description, status, startDate, endDate, questions } = req.body;

    if (!researcher || !title) {
      return res.status(400).json({ message: 'Researcher and title are required' });
    }

    const newStudy = new Study({
      researcher,
      title,
      description,
      status,
      startDate,
      endDate,
      questions,
    });

    const savedStudy = await newStudy.save();
    res.status(201).json(savedStudy);
  } catch (error) {
    res.status(500).json({ message: 'Error creating study', error: error.message });
  }
};

/**
 * @desc Update an existing study
 * @route PUT /api/studies/:id
 */
const updateStudy = async (req, res) => {
  try {
    const { researcher, title, description, status, startDate, endDate, questions } = req.body;

    const updated = await Study.findByIdAndUpdate(
      req.params.id,
      { researcher, title, description, status, startDate, endDate, questions },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Study not found' });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating study', error: error.message });
  }
};

/**
 * @desc Delete a study
 * @route DELETE /api/studies/:id
 */
const deleteStudy = (req, res) => deleteModel(Study, req, res, 'Study');

module.exports = {
  getStudies,
  getStudyById,
  createStudy,
  updateStudy,
  deleteStudy,
};

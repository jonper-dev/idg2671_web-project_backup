const Study = require('../models/study');
const Artefact = require('../models/artefact');
const { getById, getModel, deleteModel } = require('../utils/helpers/controllerHelpers');

/**
 * @desc Fetch all studies
 * @route GET /api/studies
 */
const getStudies = (req, res) => getModel(Study, req, res, 'Study');

/**
 * @desc Fetch a single study by ID, populating the questions with artifacts.
 * @route GET /api/studies/:id
 */
// GET a single study and inject its artifacts into the correct questions.
const getStudyById = async (req, res) => {
  try {
    const study = await Study.findById(req.params.id).lean();
    if (!study) return res.status(404).json({ message: "Study not found" });

    // Getting all artifacts belonging to this study.
    const artefacts = await Artefact.find({ study: study._id }).lean();

    // Mapping artifacts into their respective questions.
    const questionsWithArtefacts = study.questions.map((question) => {
      const matchingArtefacts = artefacts.filter((a) =>
        a.questionText  === question.questionText
      );

      return {
        ...question,
        artefacts: matchingArtefacts.map((a) => ({
          url: a.fileUrl,
          file: { name: a.fileUrl.split('/').pop() },
        })),
      };
    });

    study.questions = questionsWithArtefacts;

    res.json({ study });
  } catch (error) {
    console.error('Error fetching study with artefacts:', error);
    res.status(500).json({ message: "Failed to fetch study", error: error.message });
  }
};

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
    res.status(201).json({ savedStudy });
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

const express = require('express');
const router = express.Router();
const studyController = require('../controllers/studyController');

// GET all studies
router.get('/studies', studyController.getStudies);

// GET a study by ID
router.get('/studies/:id', studyController.getStudyById);

// POST a new study
router.post('/studies', studyController.createStudy);

// PUT to update an existing study
router.put('/studies/:id', studyController.updateStudy);

// DELETE a study
router.delete('/studies/:id', studyController.deleteStudy);

module.exports = router;

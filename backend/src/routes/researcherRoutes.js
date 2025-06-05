const express = require('express');
const router = express.Router();
const Researcher = require('../controllers/researcherController')

router.get('/Researcher', Researcher.getResearchers);
router.get('/Researcher/:id', Researcher.getResearcherById);
router.post('/Researcher', Researcher.registerResearcher)
router.put('/Researcher/:id', Researcher.updateResearcher);
router.delete('/Researcher/:id', Researcher.deleteResearcher)

module.exports = router;
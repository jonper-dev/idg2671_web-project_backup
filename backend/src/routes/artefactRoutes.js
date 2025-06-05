const express = require('express');
const router = express.Router();
const Artefact = require('../controllers/artefactController')

//kanskje endre til /studies/:id/artefacts? , blir 3 levels som kanskje ikke er så bra 
router.get('/artefacts', Artefact.getArtefacts);
router.get('/artefacts/:id', Artefact.getArtefactById);
router.post('/artefacts', Artefact.createArtefact)
router.put('/artefacts/:id', Artefact.updateArtefact);
router.delete('/artefacts/:id', Artefact.deleteArtefact)

module.exports = router;
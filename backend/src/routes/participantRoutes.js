const express = require('express');
const router = express.Router();
const Participant = require('../controllers/participantController')

router.get('/participants', Participant.getParticipants);
router.get('/participants/:id', Participant.getParticipantById);
router.post('/participants', Participant.createAParticipant)
router.put('/participants/:id', Participant.updateParticipant);
router.delete('/participants/:id', Participant.deleteParticipant)

module.exports = router;
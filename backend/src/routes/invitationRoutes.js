const express = require("express");
const router = express.Router();
const invitationController = require('../controllers/invitationController'); 


//sjekke disse
router.get("/invitation", invitationController.getInvitations);
router.get("/invitation/:id", invitationController.getInvitationById);
router.post('/invitation', invitationController.createInvitation); 
router.delete('/invitation/:id', invitationController.deleteInvitation);



module.exports = router;

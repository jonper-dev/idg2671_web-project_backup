const Invitation = require('../models/invitation'); 
const { getById, getModel, deleteModel } = require('../utils/helpers/controllerHelpers'); 


//sjekk om funker
const getInvitations = (req, res) => getModel(Invitation, res, req, 'Invitation'); 

//get a Invitation
const getInvitationById = (req, res) => getById(Invitation, res, req, 'Invitation'); 

//sletter denne studies og? 
const deleteInvitation = (req, res) => deleteModel(Invitation, req, res, 'Invitation')
 
const createInvitation = async(req, res) => {
    try{
        const {study,status, sentAt } = req.body
        const newInvitation = {
            study, 
            status, 
            sentAt
        };
        const savedInvitation = newInvitation.save(); 
        if(!savedInvitation){
            return res.status(404).json({message: 'Error creating invitation'}); 
        }
        res.status(201).json({savedInvitation})
    }catch(error){
        res.status(500).json({message: `Error creating invitation: ${error.message}`}); 
    }

}



//update 

const updateInvitation = async(req, res) => {

    try {
        const {study,  status,  sentAt } = req.body; 
        const updatedInvitation = Invitation.findByIdAndUpdate(
            req.params.id, 
            {study, status, sentAt},
            {new: true, runValidators: true }); 

      if (!updatedInvitation) {
      return res.status(404).json({ message: 'Invitation not found' }); 
    }
         res.status(200).json(updatedInvitation); 
    }catch(error){
        res.status(500).json({message: `Error updating the invitation: ${error.message}`});
    }

}
module.exports = {
    getInvitations,
    getInvitationById,
    deleteInvitation,
    createInvitation,
    updateInvitation

}; 
const Participant = require('../models/participant.js')
const { getById, getModel, deleteModel } = require('../utils/helpers/controllerHelpers'); 

//sjekk om funker
const getParticipants = (req, res) => getModel(Participant, res, req, 'Participant'); 

//get a Participant
const getParticipantById = (req, res) => getById(Participant, res, req, 'Participant'); 


const deleteParticipant = (req, res) => deleteModel(Participant, req, res, 'Participant')

//
//create
const createAParticipant = async (req, res) => {
  try {
    const newParticipant = new Participant(); 
    const savedParticipant = await newParticipant.save();

    res.status(201).json(savedParticipant); 
  } catch (error) {
    res.status(500).json({ message: `Error creating Participant: ${error.message}` });
  }
};


//not needed only for fixing and debugging backend !!Remove!!!
const updateParticipant = async(req, res) => {
  try {
    const {    
        _id
     } = req.body; 

    const updatedParticipant = await Participant.findByIdAndUpdate(
      req.params.id,
      { _id}, 
      { new: true, runValidators: true }
    );

    if (!updatedParticipant) {
      return res.status(404).json({ message: 'Participant not found' }); 
    }
    res.status(200).json(updatedParticipant); 
  } catch (error) {
    res.status(500).json({ error: `Error updating Participant: ${error.message}` }); 
  }
};


module.exports = {
    createAParticipant,
    getParticipantById,
    getParticipants,
    deleteParticipant,
    updateParticipant
}
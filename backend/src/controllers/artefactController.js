const Artefact = require('../models/artefact');
const { getById, getModel, deleteModel } = require('../utils/helpers/controllerHelpers');



const getArtefactById = (req, res) => getById(Artefact, req, res, 'Artefact');

const getArtefacts = (req, res) => getModel(Artefact, req, res, 'Artefact');

const deleteArtefact = (req, res) => deleteModel(Artefact, req, res, 'Artefact')

// Create artefact 
const createArtefact = async (req, res) => {
    try {
        const { study, researcher, questionText, description, fileUrl, createdAt } = req.body;
        const newArtefact = new Artefact({
            study,
            researcher,
            questionText,
            description,
            fileUrl,
            createdAt
        });

        const savedArtefact = await newArtefact.save();
        // if(!savedArtefact){
        //     return res.status(404).json({message: 'Could not find artefact'})
        // }
        res.status(201).json(savedArtefact);

    } catch (error) {
        res.status(500).json({ message: `Error creating the artefact: ${error.message}` })
    }
}

//siste jeg hodlte på 
const updateArtefact = async (req, res) => {
    try {
        const { study, researcher, questionText, description, fileUrl, createdAt } = req.body;

        const updatedArtefact = await Artefact.findByIdAndUpdate(
            req.params.id,
            { study, researcher, questionText, description, fileUrl, createdAt },
            { new: true, runValidators: true }
        );

        if (!updatedArtefact) {
            return res.status(500).json({ message: 'Artefact not found' });
        }
        res.status(200).json({ updatedArtefact });
    } catch (error) {
        res.status(500).json({ nessage: `Error updating artefact: ${error.message}` })
    }
}



module.exports = {
    getArtefacts,
    getArtefactById,
    createArtefact,
    updateArtefact,
    deleteArtefact
}

const mongoose = require('mongoose')

const ArtefactSchema = new mongoose.Schema({
    study: { type: mongoose.Schema.Types.ObjectId, ref: "Study", required: true },
    //adding researcher id so we can filter the data later based on researcher
    researcher: { type: mongoose.Schema.Types.ObjectId, ref: "Researcher", required: true }, 
    question: { type: mongoose.Schema.Types.ObjectId, ref: "Study.questions" },
    questionText: { type: String, required: true }, // Formerly "title", now uses the actual question text.
    description: { type: String },
    fileUrl: { 
        type: String, 
        required: true,
        // Restricts allowed file types
        validate: {
            validator: function (v) {
              return /^https?:\/\/|^\/?upload\//.test(v); // Allow URLs and local paths
            },
            message: props => `${props.value} is not a valid file URL`
          }    },
    createdAt: { type: Date, default: Date.now },
});

const Artefact =  mongoose.model("Artefact", ArtefactSchema);
module.exports = Artefact;

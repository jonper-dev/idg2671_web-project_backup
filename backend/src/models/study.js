const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: String,
  feedbackType: String,
  artefacts: [
    {
      url: String,
      file: {
        name: String,
      },
    },
  ],
});

const studySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  researcher: { type: mongoose.Schema.Types.ObjectId, ref: "Researcher" },
  status: String,
  startDate: String,
  endDate: String,
  questions: [questionSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Study", studySchema);

const Response = require('../models/response');
const Participant = require('../models/participant');

const submitResponses = async (req, res) => {
  try {
    const { studyId, answers } = req.body;

    if (!studyId || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: "Invalid submission format" });
    }

    const participant = new Participant();
    await participant.save();

    const docs = answers.map((ans) => ({
      study: studyId,
      participant: participant._id,
      questionText: ans.questionText,
      feedbackType: ans.feedbackType,
      answer: ans.answer,
    }));

    await Response.insertMany(docs);
    res.status(201).json({ message: "Responses submitted", participantId: participant._id });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { submitResponses };

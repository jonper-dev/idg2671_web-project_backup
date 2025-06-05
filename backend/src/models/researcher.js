const mongoose = require("mongoose");

const ResearcherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  //change to true when live, and not testing api
  passwordHash: { type: String, required: false },
  role: { type: String, enum: ["researcher"], default: "researcher" },
  createdAt: { type: Date, default: Date.now },
});

const Researcher = mongoose.model("Researcher", ResearcherSchema);
module.exports = Researcher;

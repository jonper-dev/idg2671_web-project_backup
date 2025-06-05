const mongoose = require('mongoose');

//unsure if we need this, but adding so we can use if needed. 

const InvitationSchema = new mongoose.Schema({
    study: { type: mongoose.Schema.Types.ObjectId, ref: "Study", required: true },
    participantId: { type: mongoose.Schema.Types.ObjectId, ref: "Participant", required: true },
    status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
    sentAt: { type: Date, default: Date.now },
  });


const Invitation =   mongoose.model("Invitation", InvitationSchema);
module.exports = Invitation
  
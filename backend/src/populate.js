require('dotenv').config({ path: __dirname + '/../.env' });
console.log("✅ MONGO_URI =", process.env.MONGO_URI);

const mongoose = require("mongoose");
const Researcher = require("./models/researcher");
const Study = require("./models/study");
const Artefact = require("./models/artefact");
const Participant = require("./models/participant");
const Response = require("./models/response");



async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // clear the collections
    await Promise.all([
        Researcher.deleteMany(),
        Study.deleteMany(),
        Artefact.deleteMany(),
        Participant.deleteMany(),
        Response.deleteMany(),
      ]);

    // create a researcher
    const researcherId = "6824a97710175a3a9e9bb9f4";

    const studies = [];

    for (let i = 1; i <= 2; i++) {
        const study = await Study.create({
            researcher: researcherId,
            title: `AI vs Human Study ${i}`,
            description: `A study to evaluate human perception of AI vs human-generated content (Phase ${i}).`,
            status: "active",
            startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          });

      studies.push(study);

      for (let j = 1; j <= 2; j++) {
        const artefact = await Artefact.create({
          study: study._id,
          researcher: researcherId,
          title: `Artefact ${j} (Study ${i})`,
          description: "Generated artefact for testing perception.",
          fileUrl: `https://picsum.photos/200/300`,
        });

        for (let k = 1; k <= 2; k++) {
            const participant = await Participant.create({});
            await Response.create({
              study: study._id,
              participant: participant._id,
              questionText: `What do you think of ${artefact.title}?`,
              feedbackType: "text-field",
              answer: Math.random() > 0.5 ? "Looks real to me." : "Feels AI-generated.",
            });
          }
          
      }
    }

    console.log(" Dummy data successfully inserted.");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed(); 

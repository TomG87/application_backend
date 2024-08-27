//template to add application details once user has been created

const mongoose = require("mongoose");
const Application = require("./models/applicationModel");

async function saveApplication() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const application = new Application({
      date: new Date("2024-08-26"),
      companyName: "test company",
      source: "www.testjobsite.com",
      applicationLink: "test link",
      remote: true,
      state: "N/A",
      response: true,
      interview: {
        date: new Date("2024-08-27"),
        time: "18:00",
        location: "Remote",
      },
      notes: "Not a good feeling",
      user: "66c74442be42fe564c156ee3",
    });

    await application.save();
    console.log("Application saved successfully");
  } catch (err) {
    console.log("Error saving application:", err);
  }
}

saveApplication();

const mongoose = require("mongoose");
const Application = require("./models/applicationModel");

async function updateApplication(applicationId, updateData) {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const updatedApplication = await Application.findByIdAndUpdate(
      applicationId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (updatedApplication) {
      console.log("Application updated successfully:", updatedApplication);
    } else {
      console.log("Application not found");
    }
  } catch (err) {
    console.log("Error updating application:", err);
  }
}

updateApplication("66cd1b0cbe42fe564c156ee7", {
  companyName: "New Company Name",
  notes: "Updated notes",
});

// to update properties on an application object ID

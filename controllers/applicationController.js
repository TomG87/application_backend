const Application = require("../models/applicationModel");
const User = require("../models/userModel");

// To add a new application
exports.createApplication = async (req, res) => {
  console.log("Request Body:", req.body);
  const { userId, ...applicationData } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const newApplication = new Application({
      ...applicationData,
      user: userId,
    });
    const savedApplication = await newApplication.save();
    res.status(201).json(savedApplication);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// To get all applications
exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find().populate("user");
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lookup single application by ID
exports.updateApplication = async (req, res) => {
  try {
    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("user"); // Optionally populate user details

    if (!updatedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(updatedApplication);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//To remove an application by ID
exports.deleteApplication = async (req, res) => {
  try {
    const deletedApplication = await Application.findByIdAndDelete(
      req.params.id
    );

    if (!deletedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Application deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

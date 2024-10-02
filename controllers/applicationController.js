const mongoose = require("mongoose");
const Application = require("../models/applicationModel");
const User = require("../models/userModel");

// To add a new application
exports.createApplication = async (req, res) => {
  try {
    const interview = JSON.parse(req.body.interview);

    if (
      !req.body.date ||
      !req.body.companyName ||
      !req.body.source ||
      !req.body.applicationLink ||
      !req.body.user
    ) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    if (interview.date && isNaN(new Date(interview.date))) {
      return res.status(400).json({ message: "Invalid interview date." });
    }

    const newApplication = new Application({
      date: req.body.date,
      companyName: req.body.companyName,
      source: req.body.source,
      applicationLink: req.body.applicationLink,
      remote: req.body.remote === "true",
      state: req.body.state,
      response: req.body.response === "true",
      interview: {
        date: interview.date || null,
        time: interview.time || null,
        location: interview.location || "",
      },
      notes: req.body.notes || null,
      user: req.body.user,
    });

    await newApplication.save();
    res.status(201).json(newApplication);
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: "Failed to create application",
      errors: err.errors || err.message,
    });
  }
};

// To get all applications
exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find().populate("user");
    res.json(applications);
  } catch (err) {
    console.error(err);
    const errors = err.errors
      ? Object.values(err.errors).map((e) => e.message)
      : [err.message];
    res.status(400).json({ message: "Failed to create application", errors });
  }
};

// Lookup single application by ID
exports.updateApplication = async (req, res) => {
  try {
    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("user");

    if (!updatedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(updatedApplication);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// To remove an application by ID
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

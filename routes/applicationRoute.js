const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const Application = require("../models/applicationModel");

// Get all applications for a specific user by user ID
router.get("/user-applications/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const applications = await Application.find({ user: userId });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new application
router.post("/", applicationController.createApplication);

// Get all applications
router.get("/", applicationController.getApplications);

// Update an application by ID
router.put("/:id", applicationController.updateApplication);

// Delete an application by ID
router.delete("/:id", applicationController.deleteApplication);

module.exports = router;

const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const Application = require("../models/applicationModel");

router.post("/", applicationController.createApplication);
router.get("/", applicationController.getApplications);

// Get applications by user ID
router.get("/user-applications/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const applications = await Application.find({ user: userId });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update application by ID
router.put("/:id", async (req, res) => {
  try {
    console.log("Update request body:", req.body);
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!application) {
      return res.status(404).send("Application not found");
    }

    res.json(application); // Send the updated application back in response
  } catch (error) {
    console.error("Error updating application:", error);
    res.status(500).send("Server error");
  }
});

// Additional routes
router.post("/create", applicationController.createApplication);
router.delete("/:id", applicationController.deleteApplication);

module.exports = router;

const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const Application = require("../models/applicationModel");

router.post("/", applicationController.createApplication);
router.get("/", applicationController.getApplications);

router.get("/user-applications/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const applications = await Application.find({ user: userId });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", applicationController.updateApplication);
router.delete("/:id", applicationController.deleteApplication);

module.exports = router;

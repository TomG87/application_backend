const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");

router.post("/", applicationController.createApplication); // Assuming this is correct
router.get("/", applicationController.getApplications);
router.get("/:id", applicationController.getUserApplications);
router.put("/:id", applicationController.updateApplication);
router.delete("/:id", applicationController.deleteApplication);

module.exports = router;

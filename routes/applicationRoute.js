const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const { authenticateUser } = require("../middleware/auth");

router.post("/create", applicationController.createApplication);
router.get("/get", applicationController.getApplications);
router.put("/update/:id", applicationController.updateApplication);
router.delete("/delete/:id", applicationController.deleteApplication);
router.get(
  "/user-applications",
  authenticateUser,
  applicationController.getUserApplications
);

module.exports = router;

const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");


router.post("/api/applications/create", applicationController.createApplication);

router.get("/api/applications/get", applicationController.getApplications);

router.put("/api/applications/update/:id", applicationController.updateApplication);

router.delete("/api/applications/delete/:id", applicationController.deleteApplication);

module.exports = router;

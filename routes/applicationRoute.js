const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");

router.post("/create", applicationController.createApplication);

router.get("/get", applicationController.getApplications);

router.put("/update/:id", applicationController.updateApplication);

router.delete("/delete/:id", applicationController.deleteApplication);

module.exports = router;

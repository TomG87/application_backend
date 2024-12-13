const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Application = require("../models/applicationModel");
const User = require("../models/userModel");
const Document = require("../models/documentModel");

const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only PDF and Word documents are allowed"), false);
    }
    cb(null, true);
  },
});

// To add a new application with a document attachment
const createApplication = [
  (req, res, next) => {
    upload.single("document")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(500).json({ message: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      const interview = JSON.parse(req.body.interview);

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

      const savedApplication = await newApplication.save();

      // If a document was uploaded, create a new Document entry
      let savedDocument = null;
      if (req.file) {
        const newDocument = new Document({
          fileName: req.file.filename,
          fileType: req.file.mimetype,
          fileSize: req.file.size,
          filePath: req.file.path,
          user: req.body.user,
          application: savedApplication._id,
        });
        savedDocument = await newDocument.save();
      }

      res.status(201).json({
        application: savedApplication,
        document: savedDocument,
      });
    } catch (err) {
      res.status(400).json({
        message: "Failed to create application",
        errors: err.errors || err.message,
      });
    }
  },
];

// To get all applications
const getApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const applications = await Application.find({ user: userId }).populate(
      "user"
    );
    res.json(applications);
  } catch (err) {
    console.error(err);
    const errors = err.errors
      ? Object.values(err.errors).map((e) => e.message)
      : [err.message];
    res
      .status(400)
      .json({ message: "Failed to retrieve applications", errors });
  }
};

// To get all applications for a specific user
const getUserApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const applications = await Application.find({ user: userId }).populate(
      "user"
    );
    res.json(applications);
  } catch (err) {
    console.error(err);
    const errors = err.errors
      ? Object.values(err.errors).map((e) => e.message)
      : [err.message];
    res
      .status(400)
      .json({ message: "Failed to retrieve applications", errors });
  }
};

// Lookup single application by ID and update
const updateApplication = [
  (req, res, next) => {
    upload.single("document")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(500).json({ message: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    console.log("Update request body:", req.body); // Log the request body
    try {
      const existingApplication = await Application.findById(req.params.id);
      if (!existingApplication) {
        return res.status(404).json({ message: "Application not found" });
      }

      existingApplication.date = req.body.date || existingApplication.date;
      existingApplication.companyName =
        req.body.companyName || existingApplication.companyName;
      existingApplication.source =
        req.body.source || existingApplication.source;
      existingApplication.applicationLink =
        req.body.applicationLink || existingApplication.applicationLink;
      existingApplication.remote =
        req.body.remote === "true" || existingApplication.remote;
      existingApplication.state = req.body.state || existingApplication.state;
      existingApplication.response =
        req.body.response === "true" || existingApplication.response;
      existingApplication.notes = req.body.notes || existingApplication.notes;

      if (req.body.interview) {
        const interview = JSON.parse(req.body.interview);
        existingApplication.interview.date =
          interview.date || existingApplication.interview.date;
        existingApplication.interview.time =
          interview.time || existingApplication.interview.time;
        existingApplication.interview.location =
          interview.location || existingApplication.interview.location;
      }

      if (req.file) {
        existingApplication.document = req.file.path;
      }

      const updatedApplication = await existingApplication.save();

      res.status(200).json(updatedApplication);
    } catch (err) {
      console.error("Error during update:", err);
      res.status(400).json({ message: err.message });
    }
  },
];

// To remove an application by ID
const deleteApplication = async (req, res) => {
  try {
    const deletedApplication = await Application.findByIdAndDelete(
      req.params.id
    );

    if (!deletedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Application deleted successfully" });
  } catch (err) {
    console.error("Error deleting application:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createApplication,
  getApplications,
  getUserApplications,
  updateApplication,
  deleteApplication,
};

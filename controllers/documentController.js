const Document = require("../models/documentModel");
const User = require("../models/userModel");
const Application = require("../models/applicationModel");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

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

exports.uploadDocument = [
  (req, res, next) => {
    // File upload middleware
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
      const { userId, applicationId } = req.body;

      console.log("userId:", userId);
      console.log("applicationId:", applicationId);

      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      let application;
      if (applicationId) {
        application = await Application.findById(applicationId);
        if (!application) {
          return res.status(400).json({ message: "Invalid application ID" });
        }
      }

      console.log("req.file:", req.file);

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const newDocument = new Document({
        fileName: req.file.filename,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        filePath: req.file.path,
        user: userId,
        application: applicationId || null,
      });

      const savedDocument = await newDocument.save();
      res.status(201).json(savedDocument);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
];

exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

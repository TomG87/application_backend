const Document = require("../models/documentModel");
const User = require("../models/userModel");
const Application = require("../models/applicationModel");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

exports.uploadDocument = [
  upload.single("document"),
  async (req, res) => {
    try {
      const { userId, applicationId } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ message: "Invalid user ID " });
      }

      let application;
      if (applicationId) {
        application = await Application.findById(applicationId);
        if (!applicationId) {
          return res.status(400).json({ message: "Invalid application ID" });
        }
      }

      const newDocument = new Document({
        fileName: req.file.filename,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        filePath: req.file.path,
        user: userId,
        applicaiton: applicationId || null,
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

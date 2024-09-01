const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    required: false,
  },
});

const Document = mongoose.model("Document", documentSchema);

module.exports = Document;

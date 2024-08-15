const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  applicationLink: {
    type: String,
    required: true,
  },
  remote: {
    type: Boolean,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  response: {
    type: Boolean,
    required: false,
  },
  interview: {
    date: { type: Date },
    time: { type: String },
    location: { type: String },
  },
  notes: {
    type: String,
    required: false, // Made optional for flexibility
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;

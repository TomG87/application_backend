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
    required: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

applicationSchema.set("toJSON", {
  transform: (doc, ret) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    ret.date = ret.date
      ? ret.date.toLocaleDateString("en-US", options)
      : ret.date;
    if (ret.interview && ret.interview.date) {
      ret.interview.date = ret.interview.date.toLocaleDateString(
        "en-US",
        options
      );
    }
    return ret;
  },
});

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;

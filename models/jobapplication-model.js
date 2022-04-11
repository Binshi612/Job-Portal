const mongoose = require("mongoose");

const JobApplicationSchema = new mongoose.Schema({
  comapny_id: {
    type: String,
    required: [true, "Must Provide Company_id"],
    trim: true,
  },
  user_id: {
    type: String,
    required: [true, "Must Provide user_id"],
    trim: true,
  },
  user_mobile: {
    type: String,
    required: [true, "Must Provide mobile"],
    trim: true,
  },

  user_name: {
    type: String,
    required: [true, "Must Provide username"],
    trim: true,
  },
  dateApplied: {
    type: String,
    required: [true, "Must Provide datePosted"],
    trim: true,
  },
  status: {
    type: String,
    required: [true, "Must Provide company name"],
    trim: true,
    default: "active",
  },
});

module.exports = mongoose.model("JobApplication", JobApplicationSchema);

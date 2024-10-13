const { default: mongoose } = require("mongoose");

const issueSchema = new mongoose.Schema({
  project: {
    type: String,
    required: true,
  },
  issue_title: {
    type: String,
    required: true,
  },
  issue_text: {
    type: String,
    required: true,
  },
  created_by: {
    type: String,
    required: true,
  },
  assigned_to: {
    type: String,
    required: false,
  },
  status_text: {
    type: String,
    required: false,
  },
  open: {
    type: Boolean,
    default: true,
  },
});

const Url = mongoose.model("Issue", issueSchema);
module.exports = Url;

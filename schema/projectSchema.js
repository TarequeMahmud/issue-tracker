const { default: mongoose } = require("mongoose");
const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issues: [
    {
      issueId: { type: String, required: true },
      status: { type: String, enum: ["open", "close"], required: true },
    },
  ],
});

const Project = mongoose.model("Projects", projectSchema);
module.exports = Project;

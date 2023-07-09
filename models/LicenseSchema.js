const mongoose = require("mongoose");

const licenseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
});

const License = mongoose.model("License", licenseSchema);

module.exports = { License };

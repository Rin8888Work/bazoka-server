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
  qty: {
    type: Number,
  },
  pricing: {
    type: Number,
  },
  pricingLabel: {
    type: String,
  },
  module: {
    type: String,
    enum: ["DOWNLOAD", "PROFILE", "EDIT_VIDEO"],
  },
  frequency: {
    type: String,
    enum: ["MONTHLY", "YEARLY"],
  },
  order: {
    type: Number,
    default: 99,
  },
  isPopular: {
    type: Boolean,
    default: false,
  },
  expiryOn: {
    type: String,
    default: "Vĩnh viễn",
  },
});

const License = mongoose.model("License", licenseSchema);

module.exports = { License };

const mongoose = require("mongoose");

const userOverviewSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  downloadCode: {
    type: String,
  },
  profileCode: {
    type: String,
  },
  editVideoCode: {
    type: String,
  },
  downloadQty: {
    type: Number,
    default: 0,
  },
  editVideoQty: {
    type: Number,
    default: 0,
  },
  profileQty: {
    type: Number,
    default: 0,
  },
  profileExpiry: {
    type: Date,
  },
  isDownloadTrial: {
    type: Boolean,
    default: true,
  },
  isEditVideoTrial: {
    type: Boolean,
    default: true,
  },
  isProfileTrial: {
    type: Boolean,
    default: true,
  },
  isDownloadPaid: {
    type: Boolean,
    default: false,
  },
  isEditVideoPaid: {
    type: Boolean,
    default: false,
  },
  isProfilePaid: {
    type: Boolean,
    default: false,
  },
});

userOverviewSchema.index({ username: 1 }, { unique: true });

module.exports = {
  UserOverview: mongoose.model("UserOverview", userOverviewSchema),
};

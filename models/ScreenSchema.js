const mongoose = require("mongoose");

const screenSchema = new mongoose.Schema({
  order: {
    type: Number,
    default: 99,
  },
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  screenPath: {
    type: String,
  },
  description: {
    type: String,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Screen",
  },
  roleAccess: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
  ],
  packageAccess: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
    },
  ],
});

const Screen = mongoose.model("Screen", screenSchema);

module.exports = { Screen };

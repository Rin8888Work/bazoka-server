const mongoose = require("mongoose");

const screenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  url: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
  },
  level: {
    type: Number,
    default: 0,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Screen",
  },
  rolesAccess: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
  ],
  licensesAccess: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "License",
    },
  ],
  order: {
    type: Number,
    default: 99,
  },
});

const Screen = mongoose.model("Screen", screenSchema);

module.exports = { Screen };

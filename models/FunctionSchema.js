const mongoose = require("mongoose");

const functionSchema = new mongoose.Schema({
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

const Function = mongoose.model("Function", functionSchema);

module.exports = { Function };

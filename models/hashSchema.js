const mongoose = require("mongoose");

const hashSchema = new mongoose.Schema({
  hash: {
    type: String,
    required: true,
  },
});

module.exports = {
  Hash: mongoose.model("Hash", hashSchema),
};

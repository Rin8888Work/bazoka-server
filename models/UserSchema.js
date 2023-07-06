const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerify: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
    required: true,
  },
  codeExpireTime: {
    type: Date,
    required: true,
  },
});
userSchema.index({ username: 1, email: 1 }, { unique: true });
module.exports = { User: mongoose.model("User", userSchema) };

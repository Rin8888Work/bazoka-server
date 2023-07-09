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
  codeType: {
    type: String,
    required: true,
  },
  verificationCode: {
    type: String,
    required: true,
  },
  codeExpireTime: {
    type: Date,
    required: true,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
  },
  license: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "License",
  },
  screens: [
    {
      screen: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Screen",
      },
      children: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Screen",
        },
      ],
    },
  ],
});

userSchema.index({ username: 1, email: 1 }, { unique: true });

module.exports = { User: mongoose.model("User", userSchema) };

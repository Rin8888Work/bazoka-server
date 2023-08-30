const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uuidBaseboard: {
    type: String,
    required: true,
    unique: true,
  },
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
  isInit: {
    type: Boolean,
    default: false,
  },
  codeType: {
    type: String,
  },
  verificationCode: {
    type: String,
  },
  codeExpireTime: {
    type: Date,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
  },
  license: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "License",
    },
  ],
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
  refCode: {
    type: String,
    required: true,
  },
  refUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

userSchema.index({ username: 1, email: 1, uuidBaseboard: 1 }, { unique: true });

module.exports = { User: mongoose.model("User", userSchema) };

const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  walletId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wallet",
  },
  transactionType: {
    type: String,
    enum: ["DEPOSIT", "PAID_LICENSE"],
    default: "DEPOSIT",
  },
  amount: {
    type: Number,
    required: true,
  },
  information: {
    type: String,
  },
  transactionStatus: {
    type: String,
    enum: ["PENDING", "SUCCESS", "REJECT"],
    default: "PENDING",
  },
  createdDate: {
    type: Date,
    default: () => new Date(),
  },
});

module.exports = {
  Transaction: mongoose.model("Transaction", transactionSchema),
};

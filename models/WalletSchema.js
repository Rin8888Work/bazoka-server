const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  amount: {
    type: Number,
    default: 0,
  },
  affiliateAmount: {
    type: Number,
    default: 0,
  },
  username: {
    type: String,
  },
  createdDate: {
    type: Date,
    default: () => new Date(),
  },
});

module.exports = {
  Wallet: mongoose.model("Wallet", walletSchema),
};

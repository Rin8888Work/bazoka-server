const mongoose = require("mongoose");

const userAffiliateSchema = new mongoose.Schema({
  createdUsername: {
    type: String,
    required: true,
  },
  receivedUsername: {
    type: String,
    required: true,
  },
  money: {
    type: Number,
  },
  refMoney: {
    type: Number,
  },
  tracking: {
    type: String,
    enum: ["REF_CREATED", "REQUEST_WITHDRAW", "ADMIN_REVIEW", "ADMIN_PAID"],
    default: "REF_CREATED",
  },
  createdDate: {
    type: Date,
    default: () => new Date(),
  },
  updatedDate: {
    type: Date,
    default: () => new Date(),
  },
});

module.exports = {
  UserAffiliate: mongoose.model("UserAffiliate", userAffiliateSchema),
};

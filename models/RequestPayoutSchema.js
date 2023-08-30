const mongoose = require("mongoose");

const requestPayoutSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  money: {
    type: Number,
    required: true,
  },
  affiliatesIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAffiliate",
    },
  ],
});

module.exports = {
  RequestPayout: mongoose.model("RequestPayout", requestPayoutSchema),
};

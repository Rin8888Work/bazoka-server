const mongoose = require("mongoose");

const userSettingSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  payoutAccountHolder: {
    type: String,
  },
  payoutAccountNumber: {
    type: String,
  },
  payoutMethod: {
    type: String,
  },
});

module.exports = {
  UserSetting: mongoose.model("UserSetting", userSettingSchema),
};

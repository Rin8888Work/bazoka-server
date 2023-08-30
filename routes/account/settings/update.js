// routes/account/update.js
const express = require("express");
const { UserSetting } = require("../../../models/UserSettingSchema");
const { responseJson, responseCatchError } = require("../../../helpers");

const router = express.Router();

router.put("/", async (req, res) => {
  try {
    const { username } = req.user;
    const { payoutAccountHolder, payoutAccountNumber, payoutMethod } = req.body;

    const userSetting = await UserSetting.findOne({ username });
    if (userSetting?._id) {
      userSetting.payoutAccountHolder = payoutAccountHolder;
      userSetting.payoutAccountNumber = payoutAccountNumber;
      userSetting.payoutMethod = payoutMethod;
      await userSetting.save();
    }

    responseJson({
      res,
      statusCode: 200,
      data: userSetting,
      message: "Lưu lại thành công",
    });
  } catch (error) {
    responseCatchError({ res, error });
  }
});

module.exports = router;

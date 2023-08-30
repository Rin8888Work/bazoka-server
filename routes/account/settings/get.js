// routes/account/update.js
const express = require("express");
const { UserSetting } = require("../../../models/UserSettingSchema");
const { responseJson, responseCatchError } = require("../../../helpers");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { username } = req.user;

    const userSetting = await UserSetting.findOneAndUpdate(
      { username },
      { username },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    responseJson({
      res,
      statusCode: 200,
      data: userSetting,
    });
  } catch (error) {
    responseCatchError({ res, error });
  }
});

module.exports = router;

const express = require("express");
const { UserAffiliate } = require("../../models/UserAffiliateSchema");
const { User } = require("../../models/UserSchema");
const { responseJson, responseCatchError } = require("../../helpers");
const { validateDynamicFields } = require("../../helpers/validateReq");
const router = express.Router();

router.post("/", validateDynamicFields(["money"]), async (req, res) => {
  try {
    const { money } = req.body;
    const { refUser: refUserId, username } = req.user;

    const refUser = await User.findById(refUserId);

    if (!refUser._id) {
      return responseJson({
        res,
        statusCode: 400,
        message: `Username ${username} not have ref parent`,
      });
    }
    const payload = {
      createdUsername: username,
      receivedUsername: refUser.username,
      money,
      refMoney: (money * 15) / 100,
      tracking: "REF_CREATED",
    };

    const data = new UserAffiliate(payload);
    await data.save();
    responseJson({
      res,
      statusCode: 200,
      data,
    });
  } catch (error) {
    console.log({ error });
    responseCatchError({ res, error });
  }
});

module.exports = router;

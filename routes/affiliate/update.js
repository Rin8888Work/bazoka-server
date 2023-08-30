const express = require("express");
const { UserAffiliate } = require("../../models/UserAffiliateSchema");
const { responseJson, responseCatchError } = require("../../helpers");
const { validateDynamicFields } = require("../../helpers/validateReq");
const router = express.Router();

router.post(
  "/",
  validateDynamicFields(["username", "tracking"]),
  async (req, res) => {
    const { tracking } = req.body;

    if (
      ![
        "REF_CREATED",
        "REF_PAID",
        "REQUEST_WITHDRAW",
        "ADMIN_REVIEW",
        "ADMIN_PAID",
      ].includes(tracking)
    )
      return responseJson({
        res,
        statusCode: 400,
        message:
          "tracking must in REF_CREATED, REF_PAID, REQUEST_WITHDRAW, ADMIN_REVIEW, ADMIN_PAID",
      });
    try {
      const { createdUsername, receivedUsername, money } = req.body;
      const payload = {
        createdUsername,
        receivedUsername,
        money,
        refMoney: (money * 15) / 100,
        tracking: "REF_CREATED",
      };

      const data = await new UserAffiliate(payload);
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
  }
);

module.exports = router;

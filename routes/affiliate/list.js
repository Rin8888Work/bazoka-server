const express = require("express");
const { UserAffiliate } = require("../../models/UserAffiliateSchema");
const { responseJson, responseCatchError } = require("../../helpers");
const { validateDynamicFieldsGetMethod } = require("../../helpers/validateReq");
const router = express.Router();

router.get(
  "/",
  validateDynamicFieldsGetMethod(["username"]),
  async (req, res) => {
    try {
      const { username } = req.query;
      const data = await UserAffiliate.find({
        receivedUsername: username,
      }).sort({ updatedDate: -1 });

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

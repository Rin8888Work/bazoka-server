// routes/account/update.js
const express = require("express");
const { UserOverview } = require("../../models/UserOverviewSchema");
const { responseJson, responseCatchError } = require("../../helpers");
const { validateDynamicFieldsGetMethod } = require("../../helpers/validateReq");

const router = express.Router();

router.get(
  "/",
  validateDynamicFieldsGetMethod(["username"]),

  async (req, res) => {
    try {
      const { username } = req.query;

      const data = await UserOverview.findOne({
        $or: [{ username }, { email: username }],
      });

      responseJson({
        res,
        statusCode: 200,
        data,
      });
    } catch (error) {
      responseCatchError({ res, error });
    }
  }
);

module.exports = router;

// routes/account/update.js
const express = require("express");
const { UserOverview } = require("../../models/UserOverviewSchema");
const { responseJson, responseCatchError } = require("../../helpers");
const { validateDynamicFields } = require("../../helpers/validateReq");

const router = express.Router();

router.put(
  "/",
  validateDynamicFields(["username"]),

  async (req, res) => {
    try {
      const { username } = req.body;

      const data = await UserOverview.findOne({
        $or: [{ username }, { email: username }],
      });

      data.downloadQty--;

      data.save();

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

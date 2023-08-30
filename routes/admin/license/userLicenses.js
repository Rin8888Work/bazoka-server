const express = require("express");
const { User } = require("../../../models/UserSchema");
const { responseJson, responseCatchError } = require("../../../helpers");
const {
  validateDynamicFieldsGetMethod,
} = require("../../../helpers/validateReq");

const router = express.Router();

router.get(
  "/",
  validateDynamicFieldsGetMethod(["username"]),
  async (req, res) => {
    try {
      const { username } = req.query;
      const licenses = await User.findOne({ username })
        .select("license")
        .populate("license");

      responseJson({
        res,
        statusCode: 200,
        message: "Danh sách Licenses",
        data: licenses,
      });
    } catch (error) {
      console.log({ error });
      responseCatchError({ res, error });
    }
  }
);

module.exports = router;

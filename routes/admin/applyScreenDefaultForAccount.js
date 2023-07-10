const express = require("express");
const { responseJson, responseCatchError } = require("../../helpers");
const { validateDynamicFields } = require("../../helpers/validateReq");
const addDefaultScreensForAccount = require("../../utils/addDefaultScreensForAccount");

const router = express.Router();

router.post(
  "/",
  [validateDynamicFields(["username", "roleCode", "licenseCode"])],
  async (req, res) => {
    try {
      const { username, roleCode, licenseCode } = req.body;

      const user = await addDefaultScreensForAccount({
        res,
        username,
        roleCode,
        licenseCode,
      });

      if (user)
        responseJson({
          res,
          statusCode: 200,
          message: "Danh sách màn hình mặc định đã được thêm cho account",
          data: user,
        });
    } catch (error) {
      responseCatchError({ res, error });
    }
  }
);

module.exports = router;

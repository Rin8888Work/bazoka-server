// routes/login.js
const express = require("express");
const { User } = require("../../models/UserSchema");
const {
  responseJson,
  compareHash,
  getFieldsFromModel,
} = require("../../helpers");
const { createToken } = require("../../helpers/jwt");
const { validateDynamicFields } = require("../../helpers/validateReq");
const { UNVERIFY_ACCOUNT } = require("../../config/errorCode");

const router = express.Router();

router.post(
  "/",
  validateDynamicFields(["email", "password"]),
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email })
        .populate({ path: "role" })
        .populate({ path: "package" })
        .populate({
          path: "screens",
          populate: [
            {
              path: "screen",
              select: "order name code description screenPath",
            },
            {
              path: "children",
              select: "order name code description screenPath",
            },
          ],
        });

      if (!user) {
        return responseJson({
          res,
          statusCode: 401,
          message: "Tài khoản hoặc mật khẩu không đúng",
        });
      }
      const isPasswordValid = await compareHash(password, user.password);

      if (!isPasswordValid) {
        return responseJson({
          res,
          statusCode: 401,
          message: "Tài khoản hoặc mật khẩu không đúng",
        });
      }

      if (!user.isVerify) {
        return responseJson({
          res,
          statusCode: 403,
          message: "Tài khoản chưa được xác minh",
          errorCode: UNVERIFY_ACCOUNT,
        });
      }

      user.screens.sort((a, b) => a.screen.order - b.screen.order);
      user.screens.forEach((screen) => {
        screen.children.sort((a, b) => a.order - b.order);
      });

      const userResponse = getFieldsFromModel(user, [
        "_id",
        "username",
        "email",
        "isVerify",
        "role",
        "package",
        "screens",
      ]);
      const token = createToken(
        getFieldsFromModel(user, [
          "_id",
          "username",
          "email",
          "isVerify",
          "role",
          "package",
        ])
      );

      responseJson({
        res,
        statusCode: 200,
        data: { token, user: userResponse },
      });
    } catch (error) {
      console.log(error);
      responseJson({
        res,
        statusCode: 500,
        error,
        message: "Đã có lỗi xảy ra. Vui lòng thử lại",
      });
    }
  }
);

module.exports = router;

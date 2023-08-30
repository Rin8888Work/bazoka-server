// routes/login.js
const express = require("express");
const { User } = require("../../models/UserSchema");
const {
  responseJson,
  compareHash,
  getFieldsFromModel,
  generateVerificationCode,
} = require("../../helpers");
const { createToken, createRefreshToken } = require("../../helpers/jwt");
const { validateDynamicFields } = require("../../helpers/validateReq");
const { UNVERIFY_ACCOUNT } = require("../../config/errorCode");
const { sendVerificationEmail } = require("../../helpers/gmailClient");
const { UserOverview } = require("../../models/UserOverviewSchema");

const router = express.Router();

router.post(
  "/",
  validateDynamicFields(["username", "password"]),
  async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({
        $or: [{ username }, { email: username }],
      })
        .populate({ path: "role" })
        .populate({ path: "license" })
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
        const { verificationCode, codeExpireTime } = generateVerificationCode();
        await sendVerificationEmail(user.email, verificationCode);
        user.verificationCode = verificationCode;
        user.codeExpireTime = codeExpireTime;
        user.save();
        return responseJson({
          data: { email: user.email },
          res,
          statusCode: 400,
          message: `Tài khoản chưa được xác minh. Kiểm tra mã trong email ${user.email} để xác nhận.`,
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
        "license",
        "screens",
        "refCode",
        "refUser",
      ]);
      const token = createToken(
        getFieldsFromModel(user, [
          "_id",
          "username",
          "email",
          "isVerify",
          "role",
          "license",
          "isInit",
          "refCode",
          "refUser",
        ])
      );
      // Create the refresh token
      const refreshToken = createRefreshToken({ userId: user._id });

      const userOverview = await UserOverview.findOne({ username }).select(
        "trialTime paidTime"
      );
      responseJson({
        res,
        statusCode: 200,
        data: {
          token,
          refreshToken,
          user: userResponse,
          userOverview: userOverview || {},
        },
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

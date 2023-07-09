const express = require("express");
const { User } = require("../../models/UserSchema");
const {
  responseJson,
  createHash,
  getFieldsFromModel,
} = require("../../helpers");
const moment = require("moment");
const { CODE_TYPE } = require("../../config/codeType");
const { createToken } = require("../../helpers/jwt");
const { validateDynamicFields } = require("../../helpers/validateReq");
const addDefaultScreensForAccount = require("../../utils/addDefaultScreensForAccount");

const router = express.Router();

router.post(
  "/",
  validateDynamicFields(["username", "verificationCode", "codeType"]),
  async (req, res) => {
    try {
      const { username, verificationCode, codeType, newPassword } = req.body;

      if (
        !Object.keys(CODE_TYPE)
          .map((k) => CODE_TYPE[k])
          .includes(codeType)
      ) {
        return responseJson({
          res,
          statusCode: 400,
          message: "Code type không hợp lệ",
        });
      }

      // Tìm user dựa trên mã xác nhận
      const user = await User.findOne({
        $or: [{ username }, { email: username }],
      });
      if (!user) {
        return responseJson({
          res,
          statusCode: 400,
          message: "Không tìm thấy tài khoản trong hệ thống",
        });
      }

      if (
        user.verificationCode !== verificationCode ||
        user.codeType !== codeType
      ) {
        return responseJson({
          res,
          statusCode: 400,
          message: "Mã xác nhận không hợp lệ",
          error: "Mã xác nhận không đúng hoặc codeType không hợp lệ",
        });
      }

      // Kiểm tra xem mã xác nhận đã hết hạn chưa
      const currentTime = moment();
      if (currentTime > moment(user.codeExpireTime)) {
        return responseJson({
          res,
          statusCode: 400,
          message: "Mã xác nhận đã hết hạn",
        });
      }

      // Xử lý code

      switch (codeType) {
        case CODE_TYPE.SIGNUP:
          user.isVerify = true;
          await user.save();
          const userWithScreens = await addDefaultScreensForAccount({
            res,
            username,
          });

          const userResponse = getFieldsFromModel(userWithScreens, [
            "_id",
            "username",
            "email",
            "isVerify",
            "role",
            "license",
            "screens",
          ]);
          const token = createToken(
            getFieldsFromModel(userWithScreens, [
              "_id",
              "username",
              "email",
              "isVerify",
              "role",
              "license",
            ])
          );

          return responseJson({
            res,
            statusCode: 200,
            message: "Xác nhận tài khoản thành công",
            data: { user: userResponse, token },
          });

        case CODE_TYPE.FORGOT_PASSWORD:
          if (!newPassword)
            return responseJson({
              res,
              statusCode: 400,
              message: "Vui lòng nhập mật khẩu mới",
            });

          user.password = await createHash(newPassword);
          user.save();

          return responseJson({
            res,
            statusCode: 200,
            message: "Cập nhật mật khẩu thành công",
          });
      }
    } catch (error) {
      console.log({ error });
      responseJson({
        res,
        statusCode: 500,
        message: "Đã có lỗi xảy ra. Vui lòng thử lại",
        error,
      });
    }
  }
);

module.exports = router;

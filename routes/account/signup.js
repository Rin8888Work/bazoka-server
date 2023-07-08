// routes/signup.js
const express = require("express");
const { User } = require("../../models/UserSchema");
const {
  responseJson,
  generateVerificationCode,
  createHash,
  responseCatchError,
  convertIdToObjectId,
} = require("../../helpers");
const router = express.Router();
const { sendVerificationEmail } = require("../../helpers/gmailClient");
const { CODE_TYPE } = require("../../config/codeType");
const { validateDynamicFields } = require("../../helpers/validateReq");
const { Role } = require("../../models/RoleSchema");
const { Package } = require("../../models/PackageSchema");

router.post(
  "/",
  validateDynamicFields(["username", "email", "password"]),
  async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const hashedPassword = await createHash(password);
      const { verificationCode, codeExpireTime } = generateVerificationCode();

      const role = await Role.findOne({ code: "USER" });
      const package = await Package.findOne({ code: "FREE" });

      const user = new User({
        username,
        email,
        password: hashedPassword,
        isVerify: false,
        verificationCode,
        codeExpireTime,
        codeType: CODE_TYPE.SIGNUP,
        package: package._id,
        role: role._id,
      });

      // Lưu user vào database
      await user.save();

      // Gửi email xác nhận
      try {
        await sendVerificationEmail(email, verificationCode);
        responseJson({
          res,
          statusCode: 201,
          message: `Đăng ký tài khoản thành công. Kiểm tra mã code được gửi đến email ${email}`,
        });
      } catch (error) {
        await User.deleteOne({ _id: user._id });

        responseJson({
          res,
          statusCode: 500,
          message: "Đã xảy ra lỗi trong quá trình gửi email. Vui lòng thử lại",
          error,
        });
      }
    } catch (error) {
      responseCatchError({ res, error });
    }
  }
);

module.exports = router;

// routes/signup.js
const express = require("express");
const {
  responseJson,
  generateVerificationCode,
  createHash,
  responseCatchError,
} = require("../../helpers");
const router = express.Router();
const { sendVerificationEmail } = require("../../helpers/gmailClient");
const { CODE_TYPE } = require("../../config/codeType");
const { validateDynamicFields } = require("../../helpers/validateReq");
const { Role } = require("../../models/RoleSchema");
const { License } = require("../../models/LicenseSchema");
const { User } = require("../../models/UserSchema");

router.post(
  "/",
  validateDynamicFields(["username", "email", "password"]),
  async (req, res) => {
    try {
      const { username, email, password, uuidBaseboard, referralCode } =
        req.body;
      const hashedPassword = await createHash(password.trim());
      const { verificationCode, codeExpireTime } = generateVerificationCode();

      const role = await Role.findOne({ code: "USER" });
      const licenses = await License.find({
        code: { $in: ["DOWNLOAD_FREE", "PROFILE_FREE", "EDIT_VIDEO_FREE"] },
      }).select("_id");

      let userData = {
        refCode: `${uuidBaseboard}_${verificationCode}`,
        uuidBaseboard,
        username: username.trim(),
        email: email.trim(),
        password: hashedPassword,
        isVerify: false,
        verificationCode,
        codeExpireTime,
        codeType: CODE_TYPE.SIGNUP,
        license: licenses,
        role: role._id,
      };

      if (referralCode) {
        const refUser = await User.findOne({
          refCode: referralCode,
        });
        if (refUser._id) userData.refUser = refUser._id;
      }

      const user = new User(userData);

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

const express = require("express");
const { User } = require("../../models/UserSchema");
const { responseJson, generateVerificationCode } = require("../../helpers");
const { sendVerificationEmail } = require("../../helpers/gmailClient");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, codeType } = req.body;

    // Tìm user dựa trên địa chỉ email
    const user = await User.findOne({ email });

    if (!user) {
      return responseJson({
        res,
        statusCode: 404,
        message: "Không tìm thấy tài khoản với địa chỉ email này",
      });
    }

    // Kiểm tra xem tài khoản đã được xác nhận hay chưa
    if (user.isVerify && codeType === "verify") {
      return responseJson({
        res,
        statusCode: 400,
        message: "Tài khoản đã được xác nhận",
      });
    }
    const { verificationCode, codeExpireTime } = generateVerificationCode();

    // Gửi lại mã xác nhận
    await sendVerificationEmail(user.email, verificationCode);
    user.verificationCode = verificationCode;
    user.codeExpireTime = codeExpireTime;
    await user.save();

    responseJson({
      res,
      statusCode: 200,
      message: "Gửi lại mã xác nhận thành công",
    });
  } catch (error) {
    console.log({ error });
    responseJson({
      res,
      statusCode: 500,
      message: "Đã có lỗi xảy ra. Vui lòng thử lại",
      error,
    });
  }
});

module.exports = router;

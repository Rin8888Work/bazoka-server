// routes/signup.js
const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../../models/UserSchema");
const { responseJson, generateVerificationCode } = require("../../helpers");
const router = express.Router();
const { sendVerificationEmail } = require("../../helpers/gmailClient");

router.post("/", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const { verificationCode, codeExpireTime } = generateVerificationCode();

    const user = new User({
      username,
      email,
      password: hashedPassword,
      isVerify: false,
      verificationCode,
      codeExpireTime,
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
    console.log({ error });
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const message = `${field} đã tồn tại trong hệ thống`;
      responseJson({
        res,
        statusCode: 400,
        message,
        error,
      });
    } else {
      responseJson({
        res,
        statusCode: 500,
        message: "Đã có lỗi xảy ra. Vui lòng thử lại",
        error,
      });
    }
  }
});

module.exports = router;

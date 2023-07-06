const express = require("express");
const { User } = require("../../models/UserSchema");
const { responseJson } = require("../../helpers");
const moment = require("moment");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { verificationCode } = req.body;

    // Tìm user dựa trên mã xác nhận
    const user = await User.findOne({ verificationCode });

    if (!user) {
      return responseJson({
        res,
        statusCode: 404,
        message: "Mã xác nhận không hợp lệ",
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

    // Cập nhật trạng thái isVerify của user
    user.isVerify = true;
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    responseJson({
      res,
      statusCode: 200,
      message: "Xác nhận tài khoản thành công",
      data: { user, token },
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

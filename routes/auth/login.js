// routes/login.js
const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../../models/UserSchema");
const jwt = require("jsonwebtoken");
const { responseJson } = require("../../helpers");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return responseJson({
        res,
        statusCode: 401,
        message: "Tài khoản hoặc mật khẩu không đúng",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return responseJson({
        res,
        statusCode: 401,
        message: "Tài khoản hoặc mật khẩu không đúng",
      });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    responseJson({
      res,
      statusCode: 201,
      data: { token, user },
    });
  } catch (error) {
    responseJson({
      res,
      statusCode: 500,
      error,
      message: "Đã có lỗi xảy ra. Vui lòng thử lại",
    });
  }
});

module.exports = router;

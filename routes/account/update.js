// routes/account/update.js
const express = require("express");
const { User } = require("../../models/UserSchema");
const {
  responseJson,
  responseCatchError,
  getFieldsFromModel,
} = require("../../helpers");

const router = express.Router();

router.put("/", async (req, res) => {
  try {
    const { role, license, screens } = req.body;
    const userId = req.user._id;

    // Cập nhật thông tin tài khoản
    const user = await User.findByIdAndUpdate(
      userId,
      { role, license, screens },
      { new: true }
    )
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
    ]);

    responseJson({
      res,
      statusCode: 200,
      message: "Cập nhật thông tin tài khoản thành công",
      data: userResponse,
    });
  } catch (error) {
    responseCatchError({ res, error });
  }
});

module.exports = router;

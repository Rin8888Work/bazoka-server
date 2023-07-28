// routes/login.js
const express = require("express");
const { User } = require("../../../models/UserSchema");
const { responseJson } = require("../../../helpers");

const router = express.Router();

router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    }).populate({
      path: "screens",
      populate: [
        {
          path: "screen",
          select: "order name code description screenPath prefixPath",
        },
        {
          path: "children",
          select: "order name code description screenPath prefixPath",
        },
      ],
    });

    user.screens.sort((a, b) => a.screen.order - b.screen.order);
    user.screens.forEach((screen) => {
      screen.children.sort((a, b) => a.order - b.order);
    });

    responseJson({
      res,
      statusCode: 200,
      data: { screens: user.screens },
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
});

module.exports = router;

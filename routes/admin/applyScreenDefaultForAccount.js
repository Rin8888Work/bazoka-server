const express = require("express");
const { responseJson, responseCatchError } = require("@/helpers");
const addDefaultScreensForAccount = require("@/utils/addDefaultScreensForAccount");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { username, email } = req.body;

    const user = await addDefaultScreensForAccount({ res, email, username });

    responseJson({
      res,
      statusCode: 200,
      message: "Danh sách màn hình mặc định đã được thêm cho account",
      data: user,
    });
  } catch (error) {
    responseCatchError({ res, error });
  }
});

module.exports = router;

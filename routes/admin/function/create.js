const express = require("express");
const { Function } = require("#/models/FunctionSchema");
const { responseJson, responseCatchError } = require("#/helpers");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, code, description } = req.body;

    const func = new Function({ name, code, description });
    await func.save();

    responseJson({
      res,
      statusCode: 201,
      message: "Tạo Function thành công",
      data: func,
    });
  } catch (error) {
    responseCatchError({ res, error });
  }
});

module.exports = router;

const express = require("express");
const { Function } = require("#/models/FunctionSchema");
const { responseJson, responseCatchError } = require("#/helpers");

const router = express.Router();

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description } = req.body;

    const func = await Function.findByIdAndUpdate(
      id,
      { name, code, description },
      { new: true }
    );

    responseJson({
      res,
      statusCode: 200,
      message: "Cập nhật thông tin Function thành công",
      data: func,
    });
  } catch (error) {
    responseCatchError({ res, error });
  }
});

module.exports = router;

const express = require("express");
const { Function } = require("@/models/FunctionSchema");
const { responseJson, responseCatchError } = require("@/helpers");

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const func = await Function.findById(id);

    if (!func) {
      return responseJson({
        res,
        statusCode: 404,
        message: "Function không tồn tại",
      });
    }

    responseJson({
      res,
      statusCode: 200,
      message: "Thông tin Function",
      data: func,
    });
  } catch (error) {
    console.log({ error });
    responseCatchError({ res, error });
  }
});

module.exports = router;

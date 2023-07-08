const express = require("express");
const { Function } = require("@/models/FunctionSchema");
const { responseJson, responseCatchError } = require("@/helpers");

const router = express.Router();

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Function.findByIdAndDelete(id);

    responseJson({
      res,
      statusCode: 200,
      message: "Xóa Function thành công",
    });
  } catch (error) {
    console.log({ error });
    responseCatchError({ res, error });
  }
});

module.exports = router;

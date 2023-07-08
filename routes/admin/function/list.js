const express = require("express");
const { Function } = require("#/models/FunctionSchema");
const { responseJson, responseCatchError } = require("#/helpers");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const funcs = await Function.find();

    responseJson({
      res,
      statusCode: 200,
      message: "Danh sách Functions",
      data: funcs,
    });
  } catch (error) {
    console.log({ error });
    responseCatchError({ res, error });
  }
});

module.exports = router;

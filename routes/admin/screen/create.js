const express = require("express");
const { Screen } = require("#/models/ScreenSchema");
const { responseJson, responseCatchError } = require("#/helpers");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      name,
      code,
      description,
      parent,
      screenPath,
      roleAccess,
      packageAccess,
      order,
    } = req.body;

    const screen = new Screen({
      name,
      code,
      description,
      parent,
      screenPath,
      roleAccess,
      packageAccess,
      order,
    });
    await screen.save();

    responseJson({
      res,
      statusCode: 201,
      message: "Tạo Screen thành công",
      data: screen,
    });
  } catch (error) {
    responseCatchError({ res, error });
  }
});

module.exports = router;

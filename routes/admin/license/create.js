const express = require("express");
const { License } = require("../../../models/LicenseSchema");
const { responseJson, responseCatchError } = require("../../../helpers");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, code, description } = req.body;

    const license = new License({ name, code, description });
    await license.save();

    responseJson({
      res,
      statusCode: 201,
      message: "Tạo License thành công",
      data: license,
    });
  } catch (error) {
    responseCatchError({ res, error });
  }
});

module.exports = router;

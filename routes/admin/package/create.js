const express = require("express");
const { Package } = require("../../../models/PackageSchema");
const { responseJson, responseCatchError } = require("../../../helpers");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, code, description } = req.body;

    const package = new Package({ name, code, description });
    await package.save();

    responseJson({
      res,
      statusCode: 201,
      message: "Tạo Package thành công",
      data: package,
    });
  } catch (error) {
    responseCatchError({ res, error });
  }
});

module.exports = router;

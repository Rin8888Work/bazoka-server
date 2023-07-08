const express = require("express");
const { Package } = require("../../../models/PackageSchema");
const { responseJson, responseCatchError } = require("../../../helpers");

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const package = await Package.findById(id);

    if (!package) {
      return responseJson({
        res,
        statusCode: 404,
        message: "Package không tồn tại",
      });
    }

    responseJson({
      res,
      statusCode: 200,
      message: "Thông tin Package",
      data: package,
    });
  } catch (error) {
    console.log({ error });
    responseCatchError({ res, error });
  }
});

module.exports = router;

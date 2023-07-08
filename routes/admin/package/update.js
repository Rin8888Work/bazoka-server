const express = require("express");
const { Package } = require("#/models/PackageSchema");
const { responseJson, responseCatchError } = require("#/helpers");

const router = express.Router();

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description } = req.body;

    const package = await Package.findByIdAndUpdate(
      id,
      { name, code, description },
      { new: true }
    );

    responseJson({
      res,
      statusCode: 200,
      message: "Cập nhật thông tin Package thành công",
      data: package,
    });
  } catch (error) {
    responseCatchError({ res, error });
  }
});

module.exports = router;

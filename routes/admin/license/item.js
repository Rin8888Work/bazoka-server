const express = require("express");
const { License } = require("../../../models/LicenseSchema");
const { responseJson, responseCatchError } = require("../../../helpers");

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const license = await License.findById(id);

    if (!license) {
      return responseJson({
        res,
        statusCode: 404,
        message: "License không tồn tại",
      });
    }

    responseJson({
      res,
      statusCode: 200,
      message: "Thông tin License",
      data: license,
    });
  } catch (error) {
    console.log({ error });
    responseCatchError({ res, error });
  }
});

module.exports = router;

const express = require("express");
const { License } = require("../../../models/LicenseSchema");
const { responseJson, responseCatchError } = require("../../../helpers");

const router = express.Router();

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description } = req.body;

    const license = await License.findByIdAndUpdate(
      id,
      { name, code, description },
      { new: true }
    );

    responseJson({
      res,
      statusCode: 200,
      message: "Cập nhật thông tin License thành công",
      data: license,
    });
  } catch (error) {
    responseCatchError({ res, error });
  }
});

module.exports = router;

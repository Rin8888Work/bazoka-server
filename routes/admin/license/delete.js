const express = require("express");
const { License } = require("../../../models/LicenseSchema");
const { responseJson, responseCatchError } = require("../../../helpers");

const router = express.Router();

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await License.findByIdAndDelete(id);

    responseJson({
      res,
      statusCode: 200,
      message: "Xóa License thành công",
    });
  } catch (error) {
    console.log({ error });
    responseCatchError({ res, error });
  }
});

module.exports = router;

const express = require("express");
const { Package } = require("../../../models/PackageSchema");
const { responseJson, responseCatchError } = require("../../../helpers");

const router = express.Router();

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Package.findByIdAndDelete(id);

    responseJson({
      res,
      statusCode: 200,
      message: "Xóa Package thành công",
    });
  } catch (error) {
    console.log({ error });
    responseCatchError({ res, error });
  }
});

module.exports = router;

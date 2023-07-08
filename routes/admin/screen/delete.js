const express = require("express");
const { Screen } = require("@/models/ScreenSchema");
const { responseJson, responseCatchError } = require("@/helpers");

const router = express.Router();

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Screen.findByIdAndDelete(id);

    responseJson({
      res,
      statusCode: 200,
      message: "Xóa Screen thành công",
    });
  } catch (error) {
    responseCatchError({ res, error });
  }
});

module.exports = router;

const express = require("express");
const { License } = require("../../../models/LicenseSchema");
const { responseJson, responseCatchError } = require("../../../helpers");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const licenses = await License.find();

    responseJson({
      res,
      statusCode: 200,
      message: "Danh sách Licenses",
      data: licenses,
    });
  } catch (error) {
    console.log({ error });
    responseCatchError({ res, error });
  }
});

module.exports = router;

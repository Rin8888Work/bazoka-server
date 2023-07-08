const express = require("express");
const { Package } = require("#/models/PackageSchema");
const { responseJson, responseCatchError } = require("#/helpers");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const packages = await Package.find();

    responseJson({
      res,
      statusCode: 200,
      message: "Danh sách Packages",
      data: packages,
    });
  } catch (error) {
    console.log({ error });
    responseCatchError({ res, error });
  }
});

module.exports = router;

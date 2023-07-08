// routes/role/list.js
const express = require("express");
const { Role } = require("#/models/RoleSchema");
const { responseJson, responseCatchError } = require("#/helpers");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const roles = await Role.find();

    responseJson({
      res,
      statusCode: 200,
      message: "Lấy danh sách Role thành công",
      data: roles,
    });
  } catch (error) {
    console.log({ error });
    responseCatchError({ res, error });
  }
});

module.exports = router;
